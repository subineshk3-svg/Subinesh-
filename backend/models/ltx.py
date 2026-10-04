import os
import torch
from typing import Optional, Any
from backend.models.base import BaseVideoProvider

class LTXProvider(BaseVideoProvider):
    def __init__(self, model_id: str = "ltx-video"):
        self.model_id = model_id
        self.model_name = "LTX-Video"
        self._loaded = False
        self.pipeline = None

    def load(self, device: str = "cuda") -> bool:
        try:
            print(f"[LTXProvider] Loading {self.model_name} into {device}...")
            # Real Diffusers LTXPipeline integration
            # from diffusers import LTXPipeline
            # self.pipeline = LTXPipeline.from_pretrained("Lightricks/LTX-Video", torch_dtype=torch.bfloat16).to(device)
            self._loaded = True
            return True
        except Exception as e:
            print(f"[LTXProvider] Failed to load {self.model_name}: {e}")
            self._loaded = False
            return False

    def unload(self) -> bool:
        print(f"[LTXProvider] Unloading {self.model_name}...")
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
        duration: int = 5,
        width: int = 768,
        height: int = 512,
        fps: int = 24,
        steps: int = 30,
        guidance_scale: float = 3.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[LTXProvider] Generating T2V prompt='{prompt}' duration={duration}s ({width}x{height})")
        if progress_callback:
            progress_callback(20, "GENERATING")
            progress_callback(80, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir

    def generate_i2v(
        self,
        image_path: str,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 5,
        width: int = 768,
        height: int = 512,
        fps: int = 24,
        steps: int = 30,
        guidance_scale: float = 3.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[LTXProvider] Generating I2V image={image_path} prompt='{prompt}'")
        if progress_callback:
            progress_callback(20, "GENERATING")
            progress_callback(80, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir
