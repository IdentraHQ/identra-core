use active_win_pos_rs::get_active_window;
use arboard::Clipboard;
use enigo::{Enigo, Keyboard, Settings, Key, Direction};
use std::thread;
use std::time::Duration;

pub fn get_active_window_title() -> Option<String> {
    match get_active_window() {
        Ok(window) => Some(format!("{} - {}", window.app_name, window.title)),
        Err(_) => None,
    }
}

pub fn capture_selected_text() -> Option<String> {
    let mut clipboard = match Clipboard::new() {
        Ok(c) => c,
        Err(_) => return None,
    };
    
    // Backup current clipboard content (ignore errors)
    let backup = clipboard.get_text().unwrap_or_default();
    
    // Setup enigo
    let mut enigo = match Enigo::new(&Settings::default()) {
        Ok(e) => e,
        Err(_) => return None,
    };
    
    // Simulate copy keystroke
    #[cfg(target_os = "macos")]
    {
        enigo.key(Key::Meta, Direction::Press).ok()?;
        enigo.key(Key::Unicode('c'), Direction::Click).ok()?;
        enigo.key(Key::Meta, Direction::Release).ok()?;
    }
    #[cfg(not(target_os = "macos"))]
    {
        enigo.key(Key::Control, Direction::Press).ok()?;
        enigo.key(Key::Unicode('c'), Direction::Click).ok()?;
        enigo.key(Key::Control, Direction::Release).ok()?;
    }

    // Give OS time to update clipboard
    thread::sleep(Duration::from_millis(100));
    
    // Read new text
    let selected_text = clipboard.get_text().ok();
    
    // Restore backup
    let _ = clipboard.set_text(backup);
    
    selected_text
}

pub fn init() {
    // Stub for screener init
}
