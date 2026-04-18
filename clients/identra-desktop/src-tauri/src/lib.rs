pub mod ipc;
pub mod screener;
pub mod setup;
pub mod state_manager;
pub mod vault;
pub mod watchdog;
pub mod window;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_setup_state(state: tauri::State<'_, state_manager::StateManager>) -> Result<state_manager::SetupState, String> {
    Ok(state.get_state().await)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let state_manager = state_manager::StateManager::new();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(state_manager)
        .setup(|app| {
            setup::init(app.handle());
            vault::init(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            ipc::ping,
            ipc::get_current_context,
            ipc::record_interaction,
            vault::encrypt_memory,
            vault::decrypt_memory,
            get_setup_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
