# src/models/yolo_onnx_model.py
import cv2
import numpy as np
import onnxruntime as ort
from .base_model import BaseModel

class YOLOOnnxModel(BaseModel):
    def __init__(self, model_path: str, input_size=(640, 640)):
        self.model_path = model_path
        self.input_size = input_size
        self.session = None
        self.input_name = None
        self.output_names = None

    def load_model(self):
        print(f"[INFO] Loading YOLO ONNX model: {self.model_path}")
        self.session = ort.InferenceSession(self.model_path, providers=["CPUExecutionProvider"])
        self.input_name = self.session.get_inputs()[0].name
        self.output_names = [output.name for output in self.session.get_outputs()]

    def preprocess(self, frame):
        img = cv2.resize(frame, self.input_size)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = np.transpose(img, (2, 0, 1))  # HWC → CHW
        img = img.astype(np.float32) / 255.0
        img = np.expand_dims(img, axis=0)
        return img

    def predict(self, frame):
        if self.session is None:
            raise ValueError("Model not loaded")

        img_input = self.preprocess(frame)
        outputs = self.session.run(self.output_names, {self.input_name: img_input})

        # NOTE: Post-processing depends on YOLO version (v5, v7, v8)
        # This is a generic example for YOLOv5 ONNX output
        detections = outputs[0][0]  # [N, 85] format

        for det in detections:
            x1, y1, x2, y2, conf, cls = det[:4], det[4], det[5:].argmax()
            if conf > 0.4:
                x1, y1, x2, y2 = map(int, det[:4])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"cls:{int(cls)} {conf:.2f}", (x1, y1 - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        return frame
