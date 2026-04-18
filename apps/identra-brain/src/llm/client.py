import os
import json
import httpx
import logging

logger = logging.getLogger("brain.llm")

class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5")
        self.user_name = os.getenv("IDENTRA_USER_NAME", "").strip()
        self.client = httpx.AsyncClient(timeout=60.0)

    def build_system_prompt(self, prompt: str, memory_context: str = "", active_window: str = "", selected_text: str = "") -> str:
        user_label = self.user_name or "the user"
        lines = [
            f"You are Identra, a general-purpose local AI assistant for {user_label}.",
            "Answer any topic the user asks about.",
            "Respond in a direct, concise, personalized way.",
            "Keep answers to 1-3 short sentences unless the user asks for more.",
            "Avoid filler, preambles, and long explanations.",
            "Use simple language and answer the question first.",
            "Use stored chat history and memories to remember prior conversations, preferences, names, and user details.",
            "Do not default to fitness, health, workout, trainer, equipment, snacks, or medical language unless the user explicitly asks for it.",
            "If the user pastes example wording or a draft response, rewrite it for the actual request instead of echoing the example topics.",
            "Do not add examples unless the user asks for examples.",
            "If something is uncertain, say so briefly and suggest the next step.",
            "If the user greets you or says hello, reply warmly and briefly without disclaimers.",
            "If the user asks for their name and no name is stored, say you do not know it yet and ask them to tell you once.",
            "If a name is stored, use only that saved name and never invent a different one.",
            "Do not mention internet access or browsing limitations unless the user explicitly asks about browsing or the web.",
        ]

        if memory_context:
            lines.append(f"Relevant past memories:\n{memory_context}")
        if active_window:
            lines.append(f"The user is currently looking at application: {active_window}")
        if selected_text:
            lines.append(f"The user has highlighted the following text:\n{selected_text}")

        lines.append("Be precise, practical, and short.")
        return "\n".join(lines)
        
    async def check_health(self) -> bool:
        """Check if Ollama service is reachable and responsive."""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags", timeout=5.0)
            return response.status_code == 200
        except Exception as e:
            logger.warning(f"Ollama health check failed: {e}")
            return False
        
    async def stream_chat(self, prompt: str, system_prompt: str = ""):
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": system_prompt,
            "stream": True
        }
        
        try:
            async with self.client.stream("POST", url, json=payload) as response:
                if response.status_code != 200:
                    logger.error(f"Ollama error: {response.status_code}")
                    yield f"data: {json.dumps({'error': 'LLM Error'})}\n\n"
                    return
                    
                async for chunk in response.aiter_lines():
                    if not chunk:
                        continue
                    try:
                        data = json.loads(chunk)
                        if "response" in data:
                            yield f"data: {json.dumps({'content': data['response']})}\n\n"
                        if data.get("done"):
                            yield f"data: {json.dumps({'done': True})}\n\n"
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to parse chunk: {chunk}")
        except Exception as e:
            logger.error(f"Failed to connect to Ollama: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

