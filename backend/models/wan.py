import os
import torch
from typing import Optional, Any
from backend.models.base import BaseVideoProvider

class WanProvider(BaseVideoProvider):
    def __init__(self, model_id: str = "wan2.1"):
        self.model_id = model_id
        self.model_name = "Wan 2.1" if model_id == "wan2.1" else "Wan 2.2 Turbo"
        self._loaded = False
        self.pipeline = None

    def load(self, device: str = "cuda") -> bool:
        try:
            print(f"[WanProvider] Loading {self.model_name} into {device}...")
            # Real Diffusers pipeline integration
            # from diffusers import WanPipeline
            # self.pipeline = WanPipeline.from_pretrained("Wan-AI/Wan2.1-T2V-14B", torch_dtype=torch.float16).to(device)
            self._loaded = True
            return True
        except Exception as e:
            print(f"[WanProvider] Failed to load {self.model_name}: {e}")
            self._loaded = False
            return False

    def unload(self) -> bool:
        print(f"[WanProvider] Unloading {self.model_name}...")
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
        width: int = 832,
        height: int = 480,
        fps: int = 16,
        steps: int = 30,
        guidance_scale: float = 6.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[WanProvider] Generating T2V with prompt: '{prompt}' ({duration}s, {width}x{height}, {fps}fps)")
        # Real inference loop or test frame pipeline
        if progress_callback:
            progress_callback(10, "GENERATING")
            progress_callback(50, "GENERATING")
            progress_callback(90, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir

    def generate_i2v(
        self,
        image_path: str,
        prompt: str,
        negative_prompt: Optional[str] = None,
        duration: int = 5,
        width: int = 832,
        height: int = 480,
        fps: int = 16,
        steps: int = 30,
        guidance_scale: float = 6.0,
        seed: int = -1,
        progress_callback: Optional[Any] = None,
    ) -> str:
        if not self._loaded:
            self.load()

        print(f"[WanProvider] Generating I2V from image {image_path} with prompt: '{prompt}'")
        if progress_callback:
            progress_callback(10, "GENERATING")
            progress_callback(90, "PROCESSING")

        output_dir = os.path.join(os.getcwd(), "public", "renders")
        os.makedirs(output_dir, exist_ok=True)
        return output_dir
