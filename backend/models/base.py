from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseVideoProvider(ABC):
    model_id: str
    model_name: str

    @abstractmethod
    def load(self, device: str = "cuda") -> bool:
        """Load model weights into GPU VRAM."""
        pass

    @abstractmethod
    def unload(self) -> bool:
        """Unload model weights and clear CUDA cache."""
        pass

    @abstractmethod
    def is_loaded(self) -> bool:
        """Check if model is currently loaded in memory."""
        pass

    @abstractmethod
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
        """Generate video from text prompt and return output video file path."""
        pass

    @abstractmethod
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
        """Generate video from input image and motion prompt."""
        pass

    def supports_i2v(self) -> bool:
        return True

    def supports_guidance(self) -> bool:
        return True
