import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger("brain.setup")


class StateManager:
    """Manages persistence of setup state to ~/.identra/state.json"""
    
    def __init__(self):
        self.state_dir = os.path.expanduser("~/.identra")
        self.state_file = os.path.join(self.state_dir, "state.json")
        os.makedirs(self.state_dir, exist_ok=True)
        
        # Default state
        self.default_state = {
            "setup_complete": False,
            "models_ready": False,
            "brain_ready": False,
            "ollama_checked": False,
            "last_update": datetime.utcnow().isoformat() + "Z",
        }
    
    def load(self) -> Dict[str, Any]:
        """Load state from disk or return default."""
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"Failed to load state file: {e}")
        return self.default_state.copy()
    
    def save(self, state: Dict[str, Any]) -> bool:
        """Save state to disk."""
        try:
            state["last_update"] = datetime.utcnow().isoformat() + "Z"
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=2)
            logger.info(f"State saved: {state}")
            return True
        except Exception as e:
            logger.error(f"Failed to save state: {e}")
            return False
    
    def set_setup_complete(self, value: bool) -> bool:
        """Mark setup as complete."""
        state = self.load()
        state["setup_complete"] = value
        return self.save(state)
    
    def set_models_ready(self, value: bool) -> bool:
        """Mark models as ready."""
        state = self.load()
        state["models_ready"] = value
        return self.save(state)
    
    def set_brain_ready(self, value: bool) -> bool:
        """Mark brain as ready."""
        state = self.load()
        state["brain_ready"] = value
        return self.save(state)
    
    def set_ollama_checked(self, value: bool) -> bool:
        """Mark Ollama as checked."""
        state = self.load()
        state["ollama_checked"] = value
        return self.save(state)
