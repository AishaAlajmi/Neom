import onnxruntime as ort
sess = ort.InferenceSession("models/yolo_pose.onnx")
print([i.name for i in sess.get_inputs()])
