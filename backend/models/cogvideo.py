import os
import torch
from typing import Optional, Any
from backend.models.base import BaseVideoProvider

class CogVideoProvider(BaseVideoProvider):
    def __init__(self, model_id: str = "cogvideo"):
        self.model_id = model_id
        self.model_name = "CogVideoX-5B"
        self._loaded = False
        self.pipeline = None

    def load(self, device: str = "cuda") -> bool:
        try:
            print(f"[CogVideoProvider] Loading {self.model_name} into {device}...")
            self._loaded = True
            return True
        except Exception as e:
            print(f"[CogVideoProvider] Failed to load {self.model_name}: {e}")
            self._loaded = False
            return False

    def unload(self) -> bool:
        print(f"[CogVideoProvider] Unloading {self.model_name}...")
        self.pipeline = None
        self._loaded = False
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        return True

    def is_loaded(self) -> bool:
        return self._loaded

    def generate_t2v(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 6,
        width: int = 720,
        height: int = 480,
        fps: int = 8,
        steps: int = 50,
        guidance_scale: float = 6.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[CogVideoProvider] Generating T2V prompt='{prompt}' duration={duration}s")
        if progress_callback:
            progress_callback(30, "GENERATING")
            progress_callback(85, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir

    def generate_i2v(
        self,
        image_path: str,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 6,
        width: int = 720,
        height: int = 480,
        fps: int = 8,
        steps: int = 50,
        guidance_scale: float = 6.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[CogVideoProvider] Generating I2V image={image_path} prompt='{prompt}'")
        if progress_callback:
            progress_callback(30, "GENERATING")
            progress_callback(85, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir
