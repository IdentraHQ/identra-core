# **Identra — Architecture**

### *Local-first AI Memory OS Layer*

---

## 1. System Overview

Identra is a **local-first AI runtime layer** that gives persistent identity and memory to all AI interactions.

It runs entirely on-device and consists of **three coordinated systems**:

```
Desktop Layer (Tauri)
    ↓ IPC
Brain Service (FastAPI + RAG)
    ↓ HTTP
Local AI Runtime (Ollama)
```

---

## 2. Core Design Principles

* **Local-first:** No external API calls required
* **Persistent identity:** Memory survives sessions, not chats
* **Observable:** Every system has health + logs
* **Deterministic setup:** First launch must never feel broken
* **Composable:** Each layer can evolve independently

---

## 3. Runtime Architecture

```
Identra Desktop (Tauri)
│
├── UI Layer (Next.js)
│   ├── Ghost Overlay (Cmd+K)
│   └── Deep Work Console
│
├── Rust Core (Nexus)
│   ├── IPC bridge
│   ├── Window control
│   ├── Screener (context capture)
│   ├── Vault (encryption)
│   └── Setup + Watchdog
│
└── Brain Service (Python - sidecar)
    ├── FastAPI server
    ├── RAG pipeline
    ├── Memory engine (ChromaDB)
    └── Ollama client
```

---

## 4. Boot & Lifecycle Flow (CRITICAL PATH)

### First Launch State Machine

```
[Start]
  ↓
Check Ollama → Install if missing
  ↓
Start Ollama daemon
  ↓
Pull models (lazy where possible)
  ↓
Start Brain Service
  ↓
Health check loop
  ↓
Mark setup complete
```

### Improvements

* Add **visible setup UI**
* Add **retry + timeout logic**
* Persist state:

```
~/.identra/state.json
{
  "setup_complete": true,
  "models_ready": true
}
```

---

## 5. Brain Service Architecture (Improved)

### Request Flow

```
User Input
  ↓
Retrieve Memory (vector search)
  ↓
Inject Context + Screen State
  ↓
LLM (Ollama)
  ↓
Response
  ↓
Background Memory Distillation
```

---

## 6. Memory System (Upgraded)

### Problem (v1)

* No deduplication
* No ranking
* No decay

### Improved Design

Each memory entry:

```json
{
  "text": "...",
  "embedding": [...],
  "weight": 1.0,
  "last_accessed": timestamp,
  "source": "chat"
}
```

### New Rules

#### 1. Deduplication

Before saving:

* Check similarity > 0.9 → merge instead of insert

#### 2. Weighting

* Increment weight if repeated
* Boost frequently retrieved memories

#### 3. Decay

* Reduce weight over time
* Drop weak memories

#### 4. Retrieval

* Sort by: similarity × weight

👉 Result: memory feels *intentional, not noisy*

---

## 7. Context Layer (Major Upgrade Opportunity)

### Current

* App name only

### Improved

| Level       | Data                          |
| ----------- | ----------------------------- |
| L1          | App name                      |
| L2          | Window title                  |
| L3          | Selected text (if accessible) |
| L4 (future) | Full document/browser context |

---

## 8. Brain Service Reliability

### Add Watchdog in Rust

```rust
loop {
    if !health_check() {
        restart_brain_service();
    }
    sleep(5s);
}
```

### Add endpoints:

* `/health`
* `/ready`

---

## 9. Streaming Responses (UX Upgrade)

### Current

* Blocking response

### Upgrade

* Enable streaming from Ollama
* Send chunks to UI

Result:

* Perceived latency ↓ massively
* Feels real-time

---

## 10. Security Model

### Current

* AES-256 vault encryption

### Missing

* ChromaDB is plaintext

### Fix

Option A (fast):

* Encrypt text before storing

Option B (better):

* Encrypted memory layer wrapper

---

## 11. Installer Improvements

### Problems

* Silent failures
* Large initial load

### Fixes

* Lazy model loading:

  * Load chat model first
  * Load distillation model later
* Progress UI
* Error fallback states

---

## 12. Process Management

### Current

* Fire-and-forget processes

### Improved

| Service | Strategy          |
| ------- | ----------------- |
| Ollama  | ensure running    |
| Brain   | watchdog restart  |
| Tauri   | main orchestrator |

---

## 13. Observability (Add This)

Add a simple local log panel:

```
~/.identra/logs/
  brain.log
  setup.log
  errors.log
```

Expose in UI:

* “Debug Panel”

---

## 14. Performance Optimizations

### Immediate Wins

* Cache embeddings for repeated queries
* Limit memory retrieval to top 3–5
* Use async everywhere in Python

---

## 15. Simplification (Important)

### Remove this for now:

* Rust ONNX embeddings

👉 You’re not using it yet → unnecessary complexity

---

## 16. Future Architecture (Post-MVP)

* Plugin system (extensions)
* Memory graph (not just vectors)
* Multi-user profiles
* Sync layer (optional cloud)

---

