import os
import time
import uuid
import math
import chromadb
from chromadb.config import Settings
import logging
from src.memory.crypto import MemoryEncryption

logger = logging.getLogger("brain.memory")

# Decay configuration
DECAY_HALF_LIFE = 30 * 24 * 3600  # 30 days in seconds
WEIGHT_THRESHOLD = 0.1  # Memories below this weight are pruned
MAX_MEMORIES = 10000  # Hard limit on collection size

class MemoryEngine:
    def __init__(self):
        db_path = os.path.expanduser("~/.identra/chroma_db")
        os.makedirs(db_path, exist_ok=True)
        self.client = chromadb.PersistentClient(path=db_path, settings=Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(
            name="identra_core_memories",
            metadata={"hnsw:space": "cosine"}
        )
        self.crypto = MemoryEncryption()
        logger.info(f"Memory Engine initialized at {db_path}")
        
        # Prune old memories on startup
        self._prune_weak_memories()

    def _decay_weight(self, weight: float, last_accessed: float, now: float) -> float:
        """Apply exponential decay based on time since last access."""
        age = now - last_accessed
        # Exponential decay: weight * 2^(-age / half_life)
        decayed = weight * math.pow(2, -age / DECAY_HALF_LIFE)
        return max(0.01, decayed)  # Never go below 0.01

    def _prune_weak_memories(self) -> int:
        """Remove memories with weight below threshold. Returns count pruned."""
        try:
            # Get all memories
            results = self.collection.get()
            if not results or not results['ids']:
                return 0
            
            now = time.time()
            to_delete = []
            
            for i, doc_id in enumerate(results['ids']):
                meta = results['metadatas'][i] if results['metadatas'] else {}
                weight = meta.get("weight", 1.0)
                last_accessed = meta.get("last_accessed", now)
                
                # Apply decay first
                decayed_weight = self._decay_weight(weight, last_accessed, now)
                
                # Mark for deletion if below threshold
                if decayed_weight < WEIGHT_THRESHOLD:
                    to_delete.append(doc_id)
            
            if to_delete:
                self.collection.delete(ids=to_delete)
                logger.info(f"Pruned {len(to_delete)} weak memories (weight < {WEIGHT_THRESHOLD})")
            
            return len(to_delete)
        except Exception as e:
            logger.error(f"Failed to prune weak memories: {e}")
            return 0

    def get_collection_count(self) -> int:
        """Get the current count of memories in the collection."""
        try:
            return self.collection.count()
        except Exception as e:
            logger.error(f"Failed to get collection count: {e}")
            return 0

    def add_memory(self, text: str, source: str = "chat"):
        # Check if we're at capacity - prune if needed
        if self.get_collection_count() >= MAX_MEMORIES:
            logger.info(f"Memory collection at capacity ({MAX_MEMORIES}), pruning weak memories...")
            self._prune_weak_memories()
        
        # Encrypt text before storage
        encrypted_text = self.crypto.encrypt(text)
        
        # 1. Deduplication check (search on encrypted text)
        results = self.collection.query(
            query_texts=[encrypted_text],
            n_results=1
        )
        
        now = time.time()
        
        # If we have a very similar memory (cosine distance < 0.1 means similarity > 0.9)
        if results and results['distances'] and len(results['distances'][0]) > 0:
            distance = results['distances'][0][0]
            if distance < 0.1:
                # Merge / Update weight
                doc_id = results['ids'][0][0]
                meta = results['metadatas'][0][0] if results['metadatas'] else {}
                
                new_weight = meta.get("weight", 1.0) + 1.0
                meta["weight"] = new_weight
                meta["last_accessed"] = now
                
                self.collection.update(
                    ids=[doc_id],
                    metadatas=[meta]
                )
                logger.info(f"Memory merged. ID: {doc_id}, New Weight: {new_weight}")
                return doc_id

        # 2. Insert new memory (encrypted)
        doc_id = str(uuid.uuid4())
        self.collection.add(
            ids=[doc_id],
            documents=[encrypted_text],
            metadatas=[{
                "weight": 1.0,
                "last_accessed": now,
                "source": source,
                "created_at": now,
                "encrypted": True
            }]
        )
        logger.info(f"New encrypted memory added. ID: {doc_id}")
        return doc_id

    def retrieve_memory(self, query: str, top_k: int = 5):
        """Retrieve memories with decay and ranking applied."""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k * 2  # Fetch more to account for pruning
        )
        
        if not results or not results['documents']:
            return []
            
        memories = []
        now = time.time()
        
        for i in range(len(results['documents'][0])):
            doc_id = results['ids'][0][i]
            encrypted_text = results['documents'][0][i]
            meta = results['metadatas'][0][i] if results['metadatas'] else {}
            distance = results['distances'][0][i]
            
            # Decrypt text if encrypted
            try:
                if meta.get("encrypted", False):
                    text = self.crypto.decrypt(encrypted_text)
                else:
                    # Backward compatibility: old plaintext memories
                    text = encrypted_text
            except Exception as e:
                logger.warning(f"Failed to decrypt memory {doc_id}: {e}")
                continue
            
            # Apply decay to current weight
            weight = meta.get("weight", 1.0)
            last_accessed = meta.get("last_accessed", now)
            current_weight = self._decay_weight(weight, last_accessed, now)
            
            # Skip if decayed below threshold
            if current_weight < WEIGHT_THRESHOLD:
                continue
            
            # Update last accessed timestamp
            meta["weight"] = current_weight
            meta["last_accessed"] = now
            self.collection.update(ids=[doc_id], metadatas=[meta])
            
            # Calculate final score: lower is better
            # Similarity (distance): lower is better → use as-is
            # Weight (decay-adjusted): higher is better → invert with 1/weight
            # Combined score: distance / weight (drives both similarity and recency)
            score = distance / max(current_weight, 0.1)
            
            memories.append({
                "id": doc_id,
                "text": text,
                "distance": distance,
                "weight": current_weight,
                "score": score
            })
        
        # Sort by combined score and return top K
        memories.sort(key=lambda x: x["score"])
        return memories[:top_k]

