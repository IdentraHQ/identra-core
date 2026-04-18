use tauri::AppHandle;

pub fn init(_app: &AppHandle) {
    let home = std::env::var("HOME").unwrap_or_default();
    if !home.is_empty() {
        let log_dir = format!("{}/.identra/logs", home);
        std::fs::create_dir_all(&log_dir).ok();
        println!("[setup] Logs directory initialized at {}", log_dir);
    } else {
        println!("[setup] WARNING: HOME environment variable not set");
        return;
    }

    let log_dir_clone = format!("{}/.identra/logs", home);
    
    // Spawn watchdog task
    tauri::async_runtime::spawn(crate::watchdog::run_watchdog_standalone(log_dir_clone));
}
