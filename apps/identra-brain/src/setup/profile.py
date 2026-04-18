import json
import logging
import os
import re
from datetime import datetime
from typing import Any, Dict, Optional

logger = logging.getLogger("brain.profile")


class UserProfileManager:
    """Persist user profile data to ~/.identra/profile.json."""

    def __init__(self):
        self.profile_dir = os.path.expanduser("~/.identra")
        self.profile_file = os.path.join(self.profile_dir, "profile.json")
        os.makedirs(self.profile_dir, exist_ok=True)
        self.default_profile = {
            "name": "",
            "last_update": datetime.utcnow().isoformat() + "Z",
        }

    def load(self) -> Dict[str, Any]:
        if os.path.exists(self.profile_file):
            try:
                with open(self.profile_file, "r") as file:
                    data = json.load(file)
                    if isinstance(data, dict):
                        return data
            except Exception as error:
                logger.warning(f"Failed to load profile file: {error}")
        return self.default_profile.copy()

    def save(self, profile: Dict[str, Any]) -> bool:
        try:
            profile["last_update"] = datetime.utcnow().isoformat() + "Z"
            with open(self.profile_file, "w") as file:
                json.dump(profile, file, indent=2)
            logger.info("User profile saved")
            return True
        except Exception as error:
            logger.error(f"Failed to save profile: {error}")
            return False

    def get_name(self) -> str:
        profile = self.load()
        return str(profile.get("name", "")).strip()

    def set_name(self, name: str) -> bool:
        cleaned = self._clean_name(name)
        if not cleaned:
            return False

        profile = self.load()
        profile["name"] = cleaned
        return self.save(profile)

    def extract_name(self, text: str) -> Optional[str]:
        patterns = [
            r"\bmy name is\s+([A-Za-z][A-Za-z\-']*(?:\s+[A-Za-z][A-Za-z\-']*){0,3})",
            r"\bcall me\s+([A-Za-z][A-Za-z\-']*(?:\s+[A-Za-z][A-Za-z\-']*){0,3})",
            r"\bi[' ]?m\s+([A-Za-z][A-Za-z\-']*(?:\s+[A-Za-z][A-Za-z\-']*){0,3})",
            r"\bi am\s+([A-Za-z][A-Za-z\-']*(?:\s+[A-Za-z][A-Za-z\-']*){0,3})",
            r"\bthis is\s+([A-Za-z][A-Za-z\-']*(?:\s+[A-Za-z][A-Za-z\-']*){0,3})",
        ]

        for pattern in patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                candidate = self._clean_name(match.group(1))
                if candidate:
                    return candidate
        return None

    def update_from_text(self, text: str) -> Optional[str]:
        name = self.extract_name(text)
        if name and self.set_name(name):
            logger.info(f"Captured user name: {name}")
            return name
        return None

    def _clean_name(self, name: str) -> str:
        cleaned = re.sub(r"[^A-Za-z\- '\\.]", "", name).strip()
        cleaned = re.sub(r"\s+", " ", cleaned)
        return cleaned