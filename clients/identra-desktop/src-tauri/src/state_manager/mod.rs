use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetupState {
    pub setup_complete: bool,
    pub models_ready: bool,
    pub brain_ready: bool,
    pub ollama_checked: bool,
    pub last_update: String,
}

impl Default for SetupState {
    fn default() -> Self {
        SetupState {
            setup_complete: false,
            models_ready: false,
            brain_ready: false,
            ollama_checked: false,
            last_update: Utc::now().to_rfc3339(),
        }
    }
}

pub struct StateManager {
    state_file: PathBuf,
    state: Arc<Mutex<SetupState>>,
}

impl StateManager {
    pub fn new() -> Self {
        let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        let state_file = PathBuf::from(format!("{}/.identra/state.json", home));

        // Create directory if needed
        if let Some(parent) = state_file.parent() {
            let _ = fs::create_dir_all(parent);
        }

        // Load existing state or create new
        let state = if state_file.exists() {
            fs::read_to_string(&state_file)
                .ok()
                .and_then(|content| serde_json::from_str(&content).ok())
                .unwrap_or_default()
        } else {
            SetupState::default()
        };

        StateManager {
            state_file,
            state: Arc::new(Mutex::new(state)),
        }
    }

    pub async fn get_state(&self) -> SetupState {
        self.state.lock().await.clone()
    }

    pub async fn set_setup_complete(&self, value: bool) {
        let mut state = self.state.lock().await;
        state.setup_complete = value;
        state.last_update = Utc::now().to_rfc3339();
        let _ = self.save_state(&state);
    }

    pub async fn set_models_ready(&self, value: bool) {
        let mut state = self.state.lock().await;
        state.models_ready = value;
        state.last_update = Utc::now().to_rfc3339();
        let _ = self.save_state(&state);
    }

    pub async fn set_brain_ready(&self, value: bool) {
        let mut state = self.state.lock().await;
        state.brain_ready = value;
        state.last_update = Utc::now().to_rfc3339();
        let _ = self.save_state(&state);
    }

    pub async fn set_ollama_checked(&self, value: bool) {
        let mut state = self.state.lock().await;
        state.ollama_checked = value;
        state.last_update = Utc::now().to_rfc3339();
        let _ = self.save_state(&state);
    }

    fn save_state(&self, state: &SetupState) -> std::io::Result<()> {
        let content = serde_json::to_string_pretty(state)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string()))?;
        fs::write(&self.state_file, content)
    }

    pub async fn reset(&self) {
        let mut state = self.state.lock().await;
        *state = SetupState::default();
        let _ = self.save_state(&state);
    }
}
