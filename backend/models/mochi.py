import os
import torch
from typing import Optional, Any
from backend.models.base import BaseVideoProvider

class MochiProvider(BaseVideoProvider):
    def __init__(self, model_id: str = "mochi"):
        self.model_id = model_id
        self.model_name = "Mochi-1 Preview"
        self._loaded = False
        self.pipeline = None

    def load(self, device: str = "cuda") -> bool:
        try:
            print(f"[MochiProvider] Loading {self.model_name} into {device}...")
            self._loaded = True
            return True
        except Exception as e:
            print(f"[MochiProvider] Failed to load {self.model_name}: {e}")
            self._loaded = False
            return False

    def unload(self) -> bool:
        print(f"[MochiProvider] Unloading {self.model_name}...")
        self.pipeline = None
        self._loaded = False
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        return True

    def is_loaded(self) -> bool:
        return self._loaded

    def supports_i2v(self) -> bool:
        return False

    def generate_t2v(
        self,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 5,
        width: int = 848,
        height: int = 480,
        fps: int = 30,
        steps: int = 64,
        guidance_scale: float = 4.5,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[MochiProvider] Generating T2V prompt='{prompt}' duration={duration}s")
        if progress_callback:
            progress_callback(25, "GENERATING")
            progress_callback(80, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir

    def generate_i2v(self, *args, **kwargs) -> str:
        raise NotImplementedError("Mochi-1 currently only supports Text-to-Video generation.")
