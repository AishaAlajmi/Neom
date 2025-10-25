import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

# src/run.py
# import cv2
# from models.example_pose_model import ExamplePoseModel

# def main():
#     model = ExamplePoseModel("models/pose_estimation/example_pose_model.h5")
#     model.load_model()

#     cap = cv2.VideoCapture(0)
#     print("[INFO] Starting camera... press 'q' to exit")

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         # Run model prediction
#         output_frame = model.predict(frame)

#         cv2.imshow("Pose Estimation Example", output_frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     main()

# src/run.py
# import cv2
# from models.yolo_onnx_model import YOLOOnnxModel

# def main():
#     model = YOLOOnnxModel("models/yolo_pose.onnx")
#     model.load_model()

#     cap = cv2.VideoCapture(0)
#     print("[INFO] Starting camera... press 'q' to exit")

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         result_frame = model.predict(frame)

#         cv2.imshow("YOLO ONNX Detection", result_frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     main()


# src/run.py

# ============= FLASK APP  =============

# from flask import Flask, render_template, request, jsonify
# import cv2
# import numpy as np
# import base64
# import onnxruntime as ort
# import io

# app = Flask(__name__)

# # Load model once at startup
# model_path = "models/yolo_pose.onnx"  # replace with your .onnx
# session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
# input_name = session.get_inputs()[0].name
# output_name = session.get_outputs()[0].name

# def preprocess_image(image_bytes):
#     nparr = np.frombuffer(image_bytes, np.uint8)
#     img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#     img_resized = cv2.resize(img, (640, 640))
#     img_input = img_resized.transpose(2, 0, 1)[None, :, :, :].astype(np.float32) / 255.0
#     return img_input, img

# def predict(img_input, img):
#     outputs = session.run([output_name], {input_name: img_input})[0]
#     # post-processing for YOLOv8 (simplified)
#     boxes = outputs[0]
#     for box in boxes:
#         x1, y1, x2, y2, conf, cls = box[:6]
#         if conf > 0.5:
#             cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0,255,0), 2)
#             cv2.putText(img, f"cls:{int(cls)} {conf:.2f}", (int(x1), int(y1)-5),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1)
#     _, buffer = cv2.imencode('.jpg', img)
#     return base64.b64encode(buffer).decode('utf-8')

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     data = request.json['image']
#     image_bytes = base64.b64decode(data.split(',')[1])
#     img_input, img = preprocess_image(image_bytes)
#     result_image_b64 = predict(img_input, img)
#     return jsonify({'result': f"data:image/jpeg;base64,{result_image_b64}"})

# if __name__ == '__main__':
#     app.run(debug=True)
