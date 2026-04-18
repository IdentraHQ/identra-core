import os
import time
import uuid
import chromadb
from chromadb.config import Settings
import logging

logger = logging.getLogger("brain.memory")

class MemoryEngine:
    def __init__(self):
        db_path = os.path.expanduser("~/.identra/chroma_db")
        os.makedirs(db_path, exist_ok=True)
        self.client = chromadb.PersistentClient(path=db_path, settings=Settings(anonymized_telemetry=False))
        self.collection = self.client.get_or_create_collection(
            name="identra_core_memories",
            metadata={"hnsw:space": "cosine"}
        )
        logger.info(f"Memory Engine initialized at {db_path}")

    def add_memory(self, text: str, source: str = "chat"):
        # 1. Deduplication check
        results = self.collection.query(
            query_texts=[text],
            n_results=1
        )
        
        now = time.time()
        
        # If we have a very similar memory (cosine distance < 0.1 means similarity > 0.9)
        if results and results['distances'] and len(results['distances'][0]) > 0:
            distance = results['distances'][0][0]
            if distance < 0.1:
                # Merge / Update weight
                doc_id = results['ids'][0][0]
                meta = results['metadatas'][0][0]
                
                new_weight = meta.get("weight", 1.0) + 1.0
                meta["weight"] = new_weight
                meta["last_accessed"] = now
                
                self.collection.update(
                    ids=[doc_id],
                    metadatas=[meta]
                )
                logger.info(f"Memory merged. ID: {doc_id}, New Weight: {new_weight}")
                return doc_id

        # 2. Insert new memory
        doc_id = str(uuid.uuid4())
        self.collection.add(
            ids=[doc_id],
            documents=[text],
            metadatas=[{
                "weight": 1.0,
                "last_accessed": now,
                "source": source
            }]
        )
        logger.info(f"New memory added. ID: {doc_id}")
        return doc_id

    def retrieve_memory(self, query: str, top_k: int = 5):
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        if not results or not results['documents']:
            return []
            
        memories = []
        now = time.time()
        
        for i in range(len(results['documents'][0])):
            doc_id = results['ids'][0][i]
            text = results['documents'][0][i]
            meta = results['metadatas'][0][i]
            distance = results['distances'][0][i]
            
            # Update last accessed
            meta["last_accessed"] = now
            self.collection.update(ids=[doc_id], metadatas=[meta])
            
            memories.append({
                "id": doc_id,
                "text": text,
                "distance": distance,
                "weight": meta.get("weight", 1.0)
            })
            
        # Custom ranking: sort by combination of similarity and weight (lower distance is better)
        # We want higher weight and lower distance to rank first. 
        # Score = distance / weight (lower score = better)
        memories.sort(key=lambda x: x["distance"] / max(x["weight"], 0.1))
        
        return memories
