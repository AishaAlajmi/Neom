# backend/src/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import base64, io
from PIL import Image
import numpy as np

from models.yolo_onnx_model import YOLOOnnxModel

app = FastAPI(title="AI Safety Vision Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080","http://127.0.0.1:8080",
        "http://localhost:8081","http://127.0.0.1:8081",
        "http://localhost:5173","http://127.0.0.1:5173",
        "http://192.168.3.138:8080","http://192.168.3.138:8081",
    ],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "models" / "yolo_pose.onnx"

model = YOLOOnnxModel(str(MODEL_PATH))
model.load_model()

class Frame(BaseModel):
    image: str  # data URL or base64

def decode_to_rgb_ndarray(s: str) -> np.ndarray:
    if "," in s:
        s = s.split(",", 1)[1]
    img = Image.open(io.BytesIO(base64.b64decode(s))).convert("RGB")
    return np.array(img)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.post("/predict/")
async def predict(frame: Frame):
    try:
        rgb = decode_to_rgb_ndarray(frame.image)
        h, w = rgb.shape[:2]
        # If your model expects BGR, use: preds = model.predict(rgb[:, :, ::-1])
        preds = model.predict(rgb)

        detections = []
        # Try to normalize common outputs to {bbox:[x,y,w,h], score, label}
        if isinstance(preds, (list, tuple)) and preds and isinstance(preds[0], (list, tuple)):
            # assume [x1,y1,x2,y2,score,(cls)]
            for p in preds:
                x1,y1,x2,y2,score = p[:5]
                cls_id = int(p[5]) if len(p) > 5 else -1
                detections.append({
                    "bbox":[int(x1), int(y1), int(x2-x1), int(y2-y1)],
                    "score": float(score),
                    "label": str(cls_id)
                })
        elif isinstance(preds, dict) and "boxes" in preds:
            # assume dict with keys boxes (xyxy), scores, labels
            boxes = preds.get("boxes", [])
            scores = preds.get("scores", [])
            labels = preds.get("labels", [])
            for i, b in enumerate(boxes):
                x1,y1,x2,y2 = b[:4]
                detections.append({
                    "bbox":[int(x1), int(y1), int(x2-x1), int(y2-y1)],
                    "score": float(scores[i]) if i < len(scores) else 0.0,
                    "label": str(labels[i]) if i < len(labels) else "-1"
                })
        else:
            # as a fallback, return raw (debug)
            return {"raw": str(type(preds)), "repr": repr(preds)[:500]}

        return {"detections": detections, "image_size": {"w": w, "h": h}}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
