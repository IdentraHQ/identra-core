# Identra — Local-first AI Memory OS Layer

Identra is a **local-first AI runtime** that gives persistent identity and memory to all AI interactions. It runs entirely on-device with a layered architecture: **Desktop UI (Tauri) ↔ Brain Service (FastAPI) ↔ Local LLM (Ollama)**.

## Quick Start

### Prerequisites
- **Rust** 1.70+
- **Python** 3.10+
- **Node.js** 18+ (for desktop UI)
- **pnpm** (package manager)
- **Ollama** (runs automatically on first launch; see [Setup](#setup) for details)

### Setup
```bash
# Clone and install dependencies
git clone https://github.com/IdentraHQ/identra-core.git
cd identra-core
just setup
```

### Run
In two separate terminals:

**Terminal 1** — Start Brain service:
```bash
just dev-brain
```

**Terminal 2** — Start Desktop app:
```bash
just dev-desktop
```

The desktop app will open. The first launch will check for Ollama and pull models (~5–15 min depending on bandwidth).

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│   Desktop UI (Tauri + React + Vite)     │
│  - Chat interface                       │
│  - Context capture (active window)      │
│  - Setup/status display                 │
└────────────────┬────────────────────────┘
                 │ IPC (local JSON-RPC)
┌────────────────▼────────────────────────┐
│   Tauri Backend (Rust)                  │
│  - IPC bridge                           │
│  - Screener (window/text capture)       │
│  - Vault (AES-256 encryption)           │
│  - Setup/watchdog                       │
└────────────────┬────────────────────────┘
                 │ HTTP (localhost:8000)
┌────────────────▼────────────────────────┐
│   Brain Service (FastAPI)               │
│  - Chat endpoint (streaming)            │
│  - Memory engine (retrieve/add)         │
│  - BackgroundDistiller (async)          │
│  - ChromaDB (vector memory)             │
└────────────────┬────────────────────────┘
                 │ HTTP (localhost:11434)
┌────────────────▼────────────────────────┐
│   Ollama (Local LLM Runtime)            │
│  - Model inference (e.g., llama3)       │
│  - Running completely offline           │
└─────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | Responsibility | Tech |
|-------|----------------|------|
| **Desktop UI** | User chat, context display, setup flow | React, TypeScript, Tauri IPC |
| **Tauri Rust** | System integration, window control, encryption | Rust, Tauri 2 |
| **Brain Service** | AI reasoning, memory retrieval, distillation | FastAPI, ChromaDB |
| **Ollama** | Local model inference | Ollama, llama3 (default) |

---

## Core Systems

### 1. Chat Flow (Streaming)
```
User types prompt
  ↓
Tauri IPC → Get current context (app name, selected text)
  ↓
POST /chat to Brain service
  ↓
Brain retrieves top 3–5 related memories (vector search)
  ↓
Builds system prompt with context + memories
  ↓
Streams response from Ollama token-by-token
  ↓
Render streamed tokens in UI
  ↓
POST /chat/record to store interaction for later distillation
```

### 2. Memory Engine
- **Insert**: New memories are checked for semantic duplicates (>0.9 similarity → merge with weight boost).
- **Retrieve**: Cosine similarity + weighted ranking: `score = distance / weight`.
- **Distillation**: Background worker summarizes chat history every 60 seconds into permanent facts.
- **Storage**: All memories stored in `~/.identra/chroma_db` (local embeddings via ChromaDB).

### 3. Setup & Watchdog
- **First launch**: Checks for Ollama, starts daemon, pulls model, marks setup complete.
- **Watchdog**: Checks Brain service health every 5 seconds; restarts if unhealthy.
- **State**: Persists setup progress to `~/.identra/state.json`.

---

## Configuration

See [.env.example](.env.example) for all environment variables.

### Key variables
```bash
# Brain Service (FastAPI)
BRAIN_HOST=127.0.0.1           # Bind address
BRAIN_PORT=8000                # Port

# Ollama Integration
OLLAMA_URL=http://localhost:11434   # Ollama endpoint
OLLAMA_MODEL=llama3                 # Model to use
OLLAMA_TIMEOUT=120                  # Inference timeout (seconds)
```

---

## Troubleshooting

### Brain service won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill blocking process
kill -9 <PID>

# Check logs
cat ~/.identra/logs/brain.log
```

### Ollama not starting
```bash
# Check if Ollama is installed
which ollama

# Manual start
ollama serve

# Check model availability
ollama list
```

### Can't connect to Brain from Desktop
```bash
# Check Brain health
curl http://127.0.0.1:8000/health
# Should return: {"status": "ok", "service": "identra-brain"}

# Check firewall
netstat -an | grep 8000
```

### Memory not persisting
```bash
# Check ChromaDB directory
ls -la ~/.identra/chroma_db

# Clear and restart (WARNING: clears memory)
rm -rf ~/.identra/chroma_db
# Restart Brain service
```

---

## File Structure

```
identra-core/
├── README.md                  # This file
├── architecture.md            # Detailed design decisions
├── agent.md                   # Coding guidelines (contributors)
├── implementation.md          # Implementation roadmap (not tracked)
│
├── Justfile                   # Build & run commands
├── Cargo.toml                 # Rust workspace config
├── .env.example               # Environment template
│
├── apps/
│   └── identra-brain/         # Brain FastAPI service
│       ├── requirements.txt   # Python dependencies
│       └── src/
│           ├── main.py        # FastAPI app
│           ├── api/           # REST endpoints
│           ├── llm/           # Ollama client
│           └── memory/        # Engine + distiller
│
├── clients/
│   └── identra-desktop/       # Desktop app (Tauri+React)
│       ├── src/               # React components
│       ├── src-tauri/         # Rust backend
│       │   ├── src/           # Tauri commands
│       │   │   ├── ipc/       # IPC bridge
│       │   │   ├── screener/  # Context capture
│       │   │   ├── vault/     # Encryption
│       │   │   ├── setup/     # Setup orchestration
│       │   │   └── window/    # Window control
│       │   └── tauri.conf.json
│       └── package.json
│
├── libs/
│   ├── identra-core/          # Shared Rust primitives
│   └── identra-crypto/        # AES-256 vault
│
└── landing/                   # Landing page (managed by Sarthak)
```

---

## Development

### Adding a new Brain endpoint
1. Add route in `apps/identra-brain/src/api/routers.py`
2. Import and test locally
3. Update Tauri IPC client if needed

### Adding a new Tauri command
1. Implement in `clients/identra-desktop/src-tauri/src/` (e.g., `clients/identra-desktop/src-tauri/src/ipc/mod.rs`)
2. Register in `invoke_handler` in `clients/identra-desktop/src-tauri/src/lib.rs`
3. Call from React via `invoke("command_name", {...})`

### Modifying memory system
- Memory engine: `apps/identra-brain/src/memory/engine.py`
- Distiller logic: `apps/identra-brain/src/memory/distiller.py`
- Always test similarity dedup and ranking before commit.

---

## Notes & Scope

- **Landing page** (`landing/`) is managed separately by Sarthak—not covered in this roadmap.
- Local-first means no telemetry or external API calls (Ollama can be self-hosted).
- All data at rest (memory, encryption keys) is stored in `~/.identra/`.

---

## License

See [LICENSE](LICENSE) for details.
