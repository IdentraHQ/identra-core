set shell := ["bash", "-c"]

default:
    @just --list

# Setup everything
setup:
    cd apps/identra-brain && rm -rf venv && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt
    cd clients/identra-desktop && pnpm install

# Run Brain Service
dev-brain:
    cd apps/identra-brain && ./venv/bin/uvicorn src.main:app --reload --port 8000

# Run Desktop App
dev-desktop:
    cd clients/identra-desktop && pnpm tauri dev

# Run all (Brain + Desktop)
dev:
    # Requires wait/trap or something similar, simple version:
    @echo "Start 'just dev-brain' in one terminal and 'just dev-desktop' in another."
