use identra_crypto::AesVault;
use std::fs;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use base64::{engine::general_purpose, Engine as _};

pub struct VaultState(pub Mutex<AesVault>);

#[tauri::command]
pub fn encrypt_memory(text: String, state: State<'_, VaultState>) -> Result<String, String> {
    let vault = state.0.lock().map_err(|_| "Lock error".to_string())?;
    let encrypted = vault.encrypt(&text).map_err(|_| "Encryption failed".to_string())?;
    Ok(general_purpose::STANDARD.encode(encrypted))
}

#[tauri::command]
pub fn decrypt_memory(base64_payload: String, state: State<'_, VaultState>) -> Result<String, String> {
    let payload = general_purpose::STANDARD.decode(base64_payload).map_err(|_| "Invalid base64".to_string())?;
    let vault = state.0.lock().map_err(|_| "Lock error".to_string())?;
    vault.decrypt(&payload).map_err(|_| "Decryption failed".to_string())
}

pub fn init(app: &AppHandle) {
    let home = std::env::var("HOME").unwrap_or_default();
    let key_path = format!("{}/.identra/.key", home);
    
    let key = if let Ok(existing_key) = fs::read(&key_path) {
        if existing_key.len() == 32 {
            let mut k = [0u8; 32];
            k.copy_from_slice(&existing_key);
            k
        } else {
            AesVault::generate_key()
        }
    } else {
        let k = AesVault::generate_key();
        let _ = fs::write(&key_path, k);
        k
    };

    let vault = AesVault::new(&key).expect("Failed to init vault");
    app.manage(VaultState(Mutex::new(vault)));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt_roundtrip() {
        let key = AesVault::generate_key();
        let vault = AesVault::new(&key).expect("Failed to create vault");
        
        let plaintext = "Secret message";
        let encrypted = vault.encrypt(plaintext).expect("Encryption failed");
        let decrypted = vault.decrypt(&encrypted).expect("Decryption failed");
        
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_different_encryptions() {
        let key = AesVault::generate_key();
        let vault = AesVault::new(&key).expect("Failed to create vault");
        
        let plaintext = "Test";
        let encrypted1 = vault.encrypt(plaintext).expect("Encryption 1 failed");
        let encrypted2 = vault.encrypt(plaintext).expect("Encryption 2 failed");
        
        // Should be different due to random nonce
        assert_ne!(encrypted1, encrypted2);
        
        // But both should decrypt to the same plaintext
        assert_eq!(vault.decrypt(&encrypted1).unwrap(), plaintext);
        assert_eq!(vault.decrypt(&encrypted2).unwrap(), plaintext);
    }
}
