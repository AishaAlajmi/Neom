from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseModel(ABC):
    """
    Abstract base class for all ML models.
    This provides a common interface that all model implementations must follow.
    """
    
    @abstractmethod
    def process_image(self, image: Any) -> Dict[str, Any]:
        """
        Process an image and return the results.
        
        Args:
            image: The input image to process (format will depend on model requirements)
            
        Returns:
            Dict containing the processing results
        """
        pass
    
    @abstractmethod
    def get_model_info(self) -> Dict[str, str]:
        """
        Get information about the model.
        
        Returns:
            Dict containing model metadata (name, version, etc.)
        """
        pass

# src/models/base_model.py
from abc import ABC, abstractmethod

class BaseModel(ABC):
    @abstractmethod
    def load_model(self):
        pass

    @abstractmethod
    def predict(self, frame):
        pass
