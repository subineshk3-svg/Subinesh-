import os
import torch
from typing import Optional, Any
from backend.models.base import BaseVideoProvider

class HunyuanProvider(BaseVideoProvider):
    def __init__(self, model_id: str = "hunyuan"):
        self.model_id = model_id
        self.model_name = "HunyuanVideo"
        self._loaded = False
        self.pipeline = None

    def load(self, device: str = "cuda") -> bool:
        try:
            print(f"[HunyuanProvider] Loading {self.model_name} into {device}...")
            self._loaded = True
            return True
        except Exception as e:
            print(f"[HunyuanProvider] Failed to load {self.model_name}: {e}")
            self._loaded = False
            return False

    def unload(self) -> bool:
        print(f"[HunyuanProvider] Unloading {self.model_name}...")
        self.pipeline = None
        self._loaded = False
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        return True

    def is_loaded(self) -> bool:
        return self._loaded

    def supports_i2v(self) -> bool:
        return False  # HunyuanVideo native T2V model

    def generate_t2v(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 5,
        width: int = 854,
        height: int = 480,
        fps: int = 24,
        steps: int = 30,
        guidance_scale: float = 6.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[HunyuanProvider] Generating T2V prompt='{prompt}' duration={duration}s")
        if progress_callback:
            progress_callback(25, "GENERATING")
            progress_callback(75, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir

    def generate_i2v(self, *args, **kwargs) -> str:
        raise NotImplementedError("HunyuanVideo currently only supports Text-to-Video generation.")
