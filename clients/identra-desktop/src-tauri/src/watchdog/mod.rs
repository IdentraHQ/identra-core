use std::process::Command;
use std::sync::{Arc, Mutex};
use std::time::{Duration, SystemTime};
use tokio::time::sleep;

pub struct BrainWatchdog {
    consecutive_failures: Arc<Mutex<u32>>,
    last_restart_attempt: Arc<Mutex<SystemTime>>,
}

impl BrainWatchdog {
    pub fn new() -> Self {
        BrainWatchdog {
            consecutive_failures: Arc::new(Mutex::new(0)),
            last_restart_attempt: Arc::new(Mutex::new(SystemTime::now())),
        }
    }

    pub async fn run(&self, log_dir: String) {
        let failures_clone = Arc::clone(&self.consecutive_failures);
        let last_restart_clone = Arc::clone(&self.last_restart_attempt);

        loop {
            // Health check attempt
            match self.health_check().await {
                Ok(true) => {
                    // Service is healthy
                    let mut failures = failures_clone.lock().unwrap();
                    if *failures > 0 {
                        log_to_file(&log_dir, &format!("[watchdog] Brain service recovered after {} failures", failures));
                    }
                    *failures = 0;
                    drop(failures); // Release lock explicitly
                    sleep(Duration::from_secs(5)).await;
                }
                _ => {
                    // Service is unhealthy
                    let mut failures = failures_clone.lock().unwrap();
                    *failures += 1;
                    let current_failures = *failures;
                    drop(failures);

                    log_to_file(&log_dir, &format!("[watchdog] Brain health check failed (attempt {})", current_failures));

                    // Check if we should attempt restart
                    if current_failures >= 3 && current_failures <= 5 {
                        let mut last_restart = last_restart_clone.lock().unwrap();
                        if last_restart.elapsed().unwrap_or(Duration::from_secs(0)) > Duration::from_secs(30) {
                            log_to_file(&log_dir, "[watchdog] Attempting to restart Brain service...");
                            self.restart_brain_service(&log_dir);
                            *last_restart = SystemTime::now();
                        }
                        drop(last_restart);
                    } else if current_failures > 5 {
                        log_to_file(&log_dir, "[watchdog] Max restart attempts reached. Manual intervention needed.");
                    }

                    // Exponential backoff: 5s base, up to 30s max
                    let backoff_secs = std::cmp::min(5 * current_failures as u64, 30);
                    sleep(Duration::from_secs(backoff_secs)).await;
                }
            }
        }
    }

    async fn health_check(&self) -> Result<bool, String> {
        match reqwest::get("http://127.0.0.1:8000/health").await {
            Ok(res) => Ok(res.status().is_success()),
            Err(e) => {
                // Try connecting to Ready endpoint as fallback
                match reqwest::get("http://127.0.0.1:8000/ready").await {
                    Ok(res) => Ok(res.status().is_success()),
                    Err(_) => Err(format!("Connection failed: {}", e)),
                }
            }
        }
    }

    fn restart_brain_service(&self, log_dir: &str) {
        // Spawn the Brain service process without keeping a reference to it
        let result = Command::new("sh")
            .arg("-c")
            .arg("cd $HOME/identra-core/apps/identra-brain && . venv/bin/activate && uvicorn src.main:app --host 127.0.0.1 --port 8000")
            .spawn();

        match result {
            Ok(_) => {
                // Let the process run independently, we only care about health checks
                log_to_file(log_dir, "[watchdog] Brain service restart initiated");
            }
            Err(e) => {
                log_to_file(log_dir, &format!("[watchdog] Failed to restart Brain: {}", e));
            }
        }
    }
}

fn log_to_file(log_dir: &str, message: &str) {
    use std::fs::OpenOptions;
    use std::io::Write;

    let log_path = format!("{}/setup.log", log_dir);
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
    {
        let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
        let _ = writeln!(file, "[{}] {}", timestamp, message);
    }
    println!("{}", message);
}

// Public async function that's guaranteed to be Send
pub async fn run_watchdog(log_dir: String) {
    println!("[setup] Starting Brain service watchdog...");
    let watchdog = BrainWatchdog::new();
    watchdog.run(log_dir).await;
}
// Standalone watchdog task that doesn't require Send trait workarounds
pub async fn run_watchdog_standalone(log_dir_param: String) {
    println!("[setup] Starting Brain service watchdog...");

    let mut consecutive_failures = 0u32;
    let mut last_restart_attempt = SystemTime::now();

    loop {
        // Health check attempt
        match check_health().await {
            Ok(true) => {
                // Service is healthy
                if consecutive_failures > 0 {
                    log_to_file(&log_dir_param, &format!("[watchdog] Brain service recovered after {} failures", consecutive_failures));
                }
                consecutive_failures = 0;
                sleep(Duration::from_secs(5)).await;
            }
            _ => {
                // Service is unhealthy
                consecutive_failures += 1;

                log_to_file(&log_dir_param, &format!("[watchdog] Brain health check failed (attempt {})", consecutive_failures));

                // Check if we should attempt restart
                if consecutive_failures >= 3 && consecutive_failures <= 5 {
                    if last_restart_attempt.elapsed().unwrap_or(Duration::from_secs(0)) > Duration::from_secs(30) {
                        log_to_file(&log_dir_param, "[watchdog] Attempting to restart Brain service...");
                        restart_brain_service(&log_dir_param);
                        last_restart_attempt = SystemTime::now();
                    }
                } else if consecutive_failures > 5 {
                    log_to_file(&log_dir_param, "[watchdog] Max restart attempts reached. Manual intervention needed.");
                }

                // Exponential backoff: 5s base, up to 30s max
                let backoff_secs = std::cmp::min(5 * consecutive_failures as u64, 30);
                sleep(Duration::from_secs(backoff_secs)).await;
            }
        }
    }
}

async fn check_health() -> Result<bool, String> {
    match reqwest::get("http://127.0.0.1:8000/health").await {
        Ok(res) => Ok(res.status().is_success()),
        Err(e) => {
            // Try connecting to Ready endpoint as fallback
            match reqwest::get("http://127.0.0.1:8000/ready").await {
                Ok(res) => Ok(res.status().is_success()),
                Err(_) => Err(format!("Connection failed: {}", e)),
            }
        }
    }
}

fn restart_brain_service(log_dir: &str) {
    // Spawn the Brain service process without keeping a reference to it
    let result = Command::new("sh")
        .arg("-c")
        .arg("cd $HOME/identra-core/apps/identra-brain && . venv/bin/activate && uvicorn src.main:app --host 127.0.0.1 --port 8000")
        .spawn();

    match result {
        Ok(_) => {
            // Let the process run independently, we only care about health checks
            log_to_file(log_dir, "[watchdog] Brain service restart initiated");
        }
        Err(e) => {
            log_to_file(log_dir, &format!("[watchdog] Failed to restart Brain: {}", e));
        }
    }
}
