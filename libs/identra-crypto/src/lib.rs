use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Key, Nonce,
};
use rand::RngCore;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum VaultError {
    #[error("Encryption failed")]
    EncryptionFailed,
    #[error("Decryption failed")]
    DecryptionFailed,
    #[error("Invalid key length")]
    InvalidKeyLength,
}

pub struct AesVault {
    cipher: Aes256Gcm,
}

impl AesVault {
    pub fn new(key_bytes: &[u8]) -> Result<Self, VaultError> {
        if key_bytes.len() != 32 {
            return Err(VaultError::InvalidKeyLength);
        }
        let key = Key::<Aes256Gcm>::from_slice(key_bytes);
        let cipher = Aes256Gcm::new(&key);
        Ok(Self { cipher })
    }

    pub fn generate_key() -> [u8; 32] {
        let mut key = [0u8; 32];
        OsRng.fill_bytes(&mut key);
        key
    }

    pub fn encrypt(&self, plaintext: &str) -> Result<Vec<u8>, VaultError> {
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng); // 96-bits; unique per message
        let ciphertext = self.cipher.encrypt(&nonce, plaintext.as_bytes())
            .map_err(|_| VaultError::EncryptionFailed)?;
        
        let mut payload = nonce.to_vec();
        payload.extend(ciphertext);
        Ok(payload)
    }

    pub fn decrypt(&self, payload: &[u8]) -> Result<String, VaultError> {
        if payload.len() < 12 {
            return Err(VaultError::DecryptionFailed);
        }
        let (nonce_bytes, ciphertext) = payload.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        let plaintext_bytes = self.cipher.decrypt(nonce, ciphertext)
            .map_err(|_| VaultError::DecryptionFailed)?;
            
        String::from_utf8(plaintext_bytes).map_err(|_| VaultError::DecryptionFailed)
    }
}
