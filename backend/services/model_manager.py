import torch
from typing import Dict, Optional
from backend.models.base import BaseVideoProvider
from backend.models.wan import WanProvider
from backend.models.ltx import LTXProvider
from backend.models.hunyuan import HunyuanProvider
from backend.models.cogvideo import CogVideoProvider
from backend.models.mochi import MochiProvider
from backend.config.models import AVAILABLE_MODELS

class ModelManager:
    def __init__(self):
        self.providers: Dict[str, BaseVideoProvider] = {
            "wan2.1": WanProvider("wan2.1"),
            "wan2.2": WanProvider("wan2.2"),
            "ltx-video": LTXProvider("ltx-video"),
            "hunyuan": HunyuanProvider("hunyuan"),
            "cogvideo": CogVideoProvider("cogvideo"),
            "mochi": MochiProvider("mochi"),
        }
        self.active_model_id: Optional[str] = "ltx-video"
        self._load_active_default()

    def _load_active_default(self):
        if self.active_model_id and self.active_model_id in self.providers:
            self.providers[self.active_model_id].load()

    def get_provider(self, model_id: str) -> BaseVideoProvider:
        if model_id not in self.providers:
            raise ValueError(f"Unsupported video model: {model_id}")
        return self.providers[model_id]

    def switch_model(self, model_id: str) -> BaseVideoProvider:
        """Safely unload existing model from VRAM and load target model."""
        if model_id == self.active_model_id and self.providers[model_id].is_loaded():
            return self.providers[model_id]

        print(f"[ModelManager] Switching GPU active model to {model_id}...")
        
        # Unload previous active model
        if self.active_model_id and self.active_model_id in self.providers:
            self.providers[self.active_model_id].unload()

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()

        # Load new model
        target_provider = self.get_provider(model_id)
        target_provider.load()
        self.active_model_id = model_id
        return target_provider

    def get_loaded_model_id(self) -> Optional[str]:
        return self.active_model_id

    def get_available_models_info(self) -> Dict[str, dict]:
        result = {}
        for key, meta in AVAILABLE_MODELS.items():
            is_active = (key == self.active_model_id)
            provider = self.providers.get(key)
            is_healthy = provider.is_loaded() if provider else False
            result[key] = {
                **meta,
                "is_active": is_active,
                "is_available": True,
                "is_loaded": is_healthy,
            }
        return result

model_manager = ModelManager()
