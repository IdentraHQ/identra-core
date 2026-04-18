use serde::Serialize;
use crate::screener;

#[derive(Serialize)]
pub struct ContextPayload {
    pub active_app: Option<String>,
    pub selected_text: Option<String>,
}

#[tauri::command]
pub fn ping() -> String {
    println!("[ipc] received ping from frontend");
    "pong".to_string()
}

#[tauri::command]
pub fn get_current_context() -> ContextPayload {
    println!("[ipc] context requested from frontend");
    ContextPayload {
        active_app: screener::get_active_window_title(),
        selected_text: screener::capture_selected_text(),
    }
}

#[tauri::command]
pub fn get_passive_context() -> ContextPayload {
    println!("[ipc] passive context requested from frontend");
    ContextPayload {
        active_app: screener::get_active_window_title(),
        selected_text: None,
    }
}

#[tauri::command]
pub async fn record_interaction(user_prompt: String, assistant_response: String) -> Result<(), String> {
    println!("[ipc] recording interaction with brain service");
    
    // Forward to Brain service for memory distillation
    let client = reqwest::Client::new();
    let result = client
        .post("http://127.0.0.1:8000/chat/record")
        .json(&serde_json::json!({
            "user_prompt": user_prompt,
            "assistant_response": assistant_response
        }))
        .send()
        .await;
    
    match result {
        Ok(resp) if resp.status().is_success() => Ok(()),
        Ok(resp) => Err(format!("Brain service returned {}", resp.status())),
        Err(e) => Err(format!("Failed to connect to brain service: {}", e)),
    }
}

pub fn init() {
    // Other IPC init if needed
}
