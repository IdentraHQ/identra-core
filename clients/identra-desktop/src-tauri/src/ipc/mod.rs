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

pub fn init() {
    // Other IPC init if needed
}
