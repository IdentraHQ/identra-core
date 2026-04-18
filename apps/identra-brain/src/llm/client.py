import os
import json
import httpx
import logging

logger = logging.getLogger("brain.llm")

class OllamaClient:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3")
        self.client = httpx.AsyncClient(timeout=60.0)
        
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

