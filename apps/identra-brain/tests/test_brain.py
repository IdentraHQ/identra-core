import pytest
import asyncio
import os
import json
import tempfile
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from src.main import app
from src.api.routers import memory_engine, llm_client
from src.memory.engine import MemoryEngine
from src.memory.crypto import MemoryEncryption


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def temp_db():
    """Temporary ChromaDB for testing."""
    with tempfile.TemporaryDirectory() as tmpdir:
        with patch.dict(os.environ, {"HOME": tmpdir}):
            engine = MemoryEngine()
            yield engine


class TestHealthEndpoints:
    """Test health and readiness endpoints."""
    
    def test_health_endpoint(self, client):
        """Test /health endpoint returns ok."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert response.json()["service"] == "identra-brain"
    
    @pytest.mark.asyncio
    async def test_ready_endpoint(self, client):
        """Test /ready endpoint with mocked Ollama."""
        # Mock Ollama health check
        with patch.object(llm_client, 'check_health', return_value=True):
            response = client.get("/ready")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] in ["ready", "degraded"]
            assert "checks" in data


class TestMemoryEngine:
    """Test memory engine core functionality."""
    
    def test_add_memory(self, temp_db):
        """Test adding a memory."""
        doc_id = temp_db.add_memory("Test memory", source="test")
        assert doc_id is not None
        assert temp_db.get_collection_count() == 1
    
    def test_memory_encryption(self, temp_db):
        """Test that memories are encrypted at rest."""
        text = "Sensitive information"
        doc_id = temp_db.add_memory(text)
        
        # Verify encryption by checking raw collection data
        results = temp_db.collection.get(ids=[doc_id])
        stored_text = results['documents'][0]
        
        # Should be base64-encoded encrypted data, not the plaintext
        assert stored_text != text
        assert len(stored_text) > len(text)  # Encrypted is longer due to nonce + tag
    
    def test_retrieve_memory_decrypts(self, temp_db):
        """Test that retrieved memories are properly decrypted."""
        original_text = "Secret fact about the user"
        temp_db.add_memory(original_text, source="distillation")
        
        # Retrieve should decrypt the memory
        results = temp_db.retrieve_memory(original_text, top_k=5)
        assert len(results) > 0
        assert results[0]["text"] == original_text
    
    def test_deduplication(self, temp_db):
        """Test that similar memories are deduplicated."""
        text1 = "The user likes coffee"
        text2 = "The user enjoys coffee"  # Very similar
        
        id1 = temp_db.add_memory(text1)
        id2 = temp_db.add_memory(text2)
        
        # Should have deduplicated into one memory
        assert temp_db.get_collection_count() == 1
        assert id1 == id2  # Same ID returned
    
    def test_memory_decay(self, temp_db):
        """Test that old memories decay in weight."""
        text = "Old memory"
        doc_id = temp_db.add_memory(text)
        
        # Manually age the memory
        results = temp_db.collection.get(ids=[doc_id])
        meta = results['metadatas'][0]
        old_time = meta['last_accessed'] - (30 * 24 * 3600)  # 30 days ago
        meta['last_accessed'] = old_time
        temp_db.collection.update(ids=[doc_id], metadatas=[meta])
        
        # Retrieve and check decayed weight
        retrieved = temp_db.retrieve_memory(text, top_k=5)
        assert len(retrieved) > 0
        # Weight should be less than 1.0 due to decay
        assert retrieved[0]["weight"] < 1.0
    
    def test_pruning_weak_memories(self, temp_db):
        """Test that very weak memories are pruned."""
        text = "Weak memory"
        doc_id = temp_db.add_memory(text)
        
        # Manually set weight to below threshold
        results = temp_db.collection.get(ids=[doc_id])
        meta = results['metadatas'][0]
        meta['weight'] = 0.05  # Below WEIGHT_THRESHOLD of 0.1
        temp_db.collection.update(ids=[doc_id], metadatas=[meta])
        
        # Trigger prune
        temp_db._prune_weak_memories()
        
        # Memory should be gone
        assert temp_db.get_collection_count() == 0


class TestCrypto:
    """Test encryption/decryption."""
    
    def test_encrypt_decrypt_roundtrip(self):
        """Test encrypt/decrypt with same key."""
        crypto = MemoryEncryption()
        plaintext = "Secret message"
        
        encrypted = crypto.encrypt(plaintext)
        decrypted = crypto.decrypt(encrypted)
        
        assert decrypted == plaintext
        assert encrypted != plaintext
    
    def test_encryption_produces_different_ciphertexts(self):
        """Test that same plaintext encrypts to different ciphertexts (due to random nonce)."""
        crypto = MemoryEncryption()
        plaintext = "Test"
        
        encrypted1 = crypto.encrypt(plaintext)
        encrypted2 = crypto.encrypt(plaintext)
        
        # Should be different due to random nonce
        assert encrypted1 != encrypted2
        
        # But both should decrypt to the same plaintext
        assert crypto.decrypt(encrypted1) == plaintext
        assert crypto.decrypt(encrypted2) == plaintext
    
    def test_is_encrypted_detection(self):
        """Test detection of encrypted vs plaintext."""
        crypto = MemoryEncryption()
        
        plaintext = "Regular text"
        encrypted = crypto.encrypt(plaintext)
        
        assert not crypto.is_encrypted(plaintext)
        assert crypto.is_encrypted(encrypted)


class TestChatAPI:
    """Test chat endpoint."""
    
    @pytest.mark.asyncio
    async def test_chat_endpoint_with_stream(self, client):
        """Test chat endpoint streams responses."""
        with patch.object(llm_client, 'stream_chat') as mock_stream:
            async def mock_streamer(prompt, system_prompt):
                yield 'data: {"content": "test"}\n\n'
                yield 'data: {"done": true}\n\n'
            
            mock_stream.return_value = mock_streamer(None, None)
            
            response = client.post(
                "/chat",
                json={"prompt": "Hello"},
                headers={"accept": "text/event-stream"}
            )
            
            assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
