import cv2
import numpy as np
from memryx import AsyncAccl
import threading

# --- Initialize both accelerators ---
accl_yolo = AsyncAccl(dfp="bestVest_fixed.dfp")
accl_fall = AsyncAccl(dfp="my_model.dfp")

# Shared frame for both models
current_frame = None
lock = threading.Lock()

# --- Letterbox Resizing Function ---
def letterbox_resize(frame, new_shape=(640, 640)):
    h, w = frame.shape[:2]
    ratio = min(new_shape[0] / h, new_shape[1] / w)  # Scale ratio
    new_w = int(w * ratio)
    new_h = int(h * ratio)
    resized_img = cv2.resize(frame, (new_w, new_h))

    # Create a blank canvas (black)
    top = (new_shape[0] - new_h) // 2
    bottom = new_shape[0] - new_h - top
    left = (new_shape[1] - new_w) // 2
    right = new_shape[1] - new_w - left

    padded_frame = cv2.copyMakeBorder(resized_img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    return padded_frame

# --- Shared video source ---
def data_source():
    global current_frame
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        with lock:
            current_frame = frame.copy()

        # Step 1: Resize with letterbox (preserve aspect ratio)
        yolo_frame = letterbox_resize(frame, (640, 640))

        # Step 2: Convert BGR to RGB (OpenCV to model)
        yolo_frame = cv2.cvtColor(yolo_frame, cv2.COLOR_BGR2RGB)

        # Step 3: Normalize and change shape for YOLO [1, 3, 640, 640]
        yolo_frame = np.transpose(yolo_frame, (2, 0, 1))  # [3, 640, 640]
        yolo_frame = np.expand_dims(yolo_frame, 0).astype(np.float32) / 255.0

        # Step 4: Resize for fall model (96, 96) and prepare as [1, 96, 96, 3]
        fall_frame = cv2.resize(frame, (96, 96))
        fall_frame = cv2.cvtColor(fall_frame, cv2.COLOR_BGR2RGB)  # RGB for fall model
        fall_frame = np.expand_dims(fall_frame, 0).astype(np.float32) / 255.0

        # Show the actual frame going to the model (debugging)
        cv2.imshow("Input to Models", yolo_frame[0].transpose(1, 2, 0))  # [H, W, C] format for imshow
        cv2.waitKey(1)

        yield (yolo_frame, fall_frame)

    cap.release()

# --- Process YOLO output ---
def process_yolo(*ofmaps):
    global current_frame
    if current_frame is None:
        return
    with lock:
        frame = current_frame.copy()
    cv2.putText(frame, "YOLO running...", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
    cv2.imshow("YOLO Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        cv2.destroyAllWindows()
        exit(0)

# --- Process Fall Detector output ---
def process_fall(*ofmaps):
    global current_frame
    if current_frame is None:
        return
    with lock:
        frame = current_frame.copy()

    output = ofmaps[0]
    pred = output[0][0] if output.shape == (1, 1) else np.argmax(output)
    fall_detected = pred > 0.5 if output.shape == (1, 1) else (pred == 1)

    label = "🚨 FALL DETECTED!" if fall_detected else "No fall"
    color = (0, 0, 255) if fall_detected else (0, 255, 0)
    cv2.putText(frame, label, (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 2)

    cv2.imshow("Fall Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        cv2.destroyAllWindows()
        exit(0)

# --- Start two async loops (in separate threads) ---
def run_yolo():
    accl_yolo.connect_input(lambda: (frame[0] for frame in data_source()))
    accl_yolo.connect_output(process_yolo)
    accl_yolo.wait()

def run_fall():
    accl_fall.connect_input(lambda: (frame[1] for frame in data_source()))
    accl_fall.connect_output(process_fall)
    accl_fall.wait()

t1 = threading.Thread(target=run_yolo)
t2 = threading.Thread(target=run_fall)
t1.start()
t2.start()

t1.join()
t2.join()
