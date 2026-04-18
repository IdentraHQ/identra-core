import os
import base64
import logging
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

logger = logging.getLogger("brain.crypto")


class MemoryEncryption:
    """Handles AES-256-GCM encryption for memory payloads."""
    
    ALGORITHM = "AES-256-GCM"
    KEY_SIZE = 32  # 256 bits
    NONCE_SIZE = 12  # 96 bits for GCM
    TAG_SIZE = 16  # 128 bits
    SALT_SIZE = 16
    
    def __init__(self):
        """Initialize encryption with key from ~/.identra/.memory_key or generate new."""
        self.key_path = os.path.expanduser("~/.identra/.memory_key")
        self.key = self._load_or_generate_key()
    
    def _load_or_generate_key(self) -> bytes:
        """Load existing key or generate new one."""
        key_dir = os.path.dirname(self.key_path)
        os.makedirs(key_dir, exist_ok=True)
        
        if os.path.exists(self.key_path):
            try:
                with open(self.key_path, 'rb') as f:
                    key = f.read()
                    if len(key) == self.KEY_SIZE:
                        logger.info("Memory encryption key loaded from disk")
                        return key
            except Exception as e:
                logger.warning(f"Failed to load existing key: {e}")
        
        # Generate new key
        key = AESGCM.generate_key(bit_length=256)
        try:
            with open(self.key_path, 'wb') as f:
                f.write(key)
            os.chmod(self.key_path, 0o600)  # Read/write for owner only
            logger.info("Generated and stored new memory encryption key")
        except Exception as e:
            logger.error(f"Failed to persist encryption key: {e}")
        
        return key
    
    def encrypt(self, plaintext: str) -> str:
        """Encrypt plaintext and return base64-encoded ciphertext + nonce."""
        try:
            import secrets
            
            # Generate random nonce
            nonce = secrets.token_bytes(self.NONCE_SIZE)
            
            # Encrypt
            cipher = AESGCM(self.key)
            ciphertext = cipher.encrypt(
                nonce,
                plaintext.encode('utf-8'),
                None  # No additional authenticated data
            )
            
            # Combine nonce + ciphertext + tag (tag is part of ciphertext in AESGCM)
            encrypted_payload = nonce + ciphertext
            
            # Return as base64 for storage
            return base64.b64encode(encrypted_payload).decode('utf-8')
        except Exception as e:
            logger.error(f"Encryption failed: {e}")
            raise
    
    def decrypt(self, encrypted_b64: str) -> str:
        """Decrypt base64-encoded ciphertext + nonce back to plaintext."""
        try:
            # Decode from base64
            encrypted_payload = base64.b64decode(encrypted_b64.encode('utf-8'))
            
            # Extract nonce and ciphertext
            nonce = encrypted_payload[:self.NONCE_SIZE]
            ciphertext = encrypted_payload[self.NONCE_SIZE:]
            
            # Decrypt
            cipher = AESGCM(self.key)
            plaintext_bytes = cipher.decrypt(nonce, ciphertext, None)
            
            return plaintext_bytes.decode('utf-8')
        except Exception as e:
            logger.error(f"Decryption failed: {e}")
            raise
    
    def is_encrypted(self, text: str) -> bool:
        """Check if text appears to be encrypted (base64 + correct structure)."""
        try:
            if not text or len(text) < 20:  # Encrypted text is always longer
                return False
            
            decoded = base64.b64decode(text.encode('utf-8'))
            # Must be at least nonce + tag
            return len(decoded) >= self.NONCE_SIZE + self.TAG_SIZE
        except Exception:
            return False
