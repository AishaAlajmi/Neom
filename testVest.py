import cv2
import numpy as np
from memryx import AsyncAccl

# Initialize MemryX accelerator
accl = AsyncAccl(dfp="bestVest_fixed.dfp")

# Keep a global variable for the last frame (for visualization)
current_frame = None

# --- INPUT FUNCTION ---
def data_source():
    global current_frame
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Keep a copy for display
        current_frame = frame.copy()

        # Preprocess for model (1,3,640,640)
        img = cv2.resize(frame, (640, 640))
        img = np.transpose(img, (2, 0, 1))  # (3,640,640)
        img = np.expand_dims(img, 0).astype(np.float32) / 255.0

        yield img  # <-- only one input tensor per frame

    cap.release()

# --- OUTPUT FUNCTION ---
def process_output(*ofmaps):
    global cuport cv2
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
#     main()rrent_frame

    # Skip if no frame to display yet
    if current_frame is None:
        return

    frame = current_frame.copy()

    # Example: Dummy detections (replace with real post-processing)
    # ofmaps may contain raw model outputs like feature maps, heatmaps, etc.
    # For now, just overlay text to confirm it’s running
    cv2.putText(frame, "Inference running...", (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Make sure frame is valid for OpenCV
    if frame.dtype != np.uint8:
        frame = np.clip(frame * 255, 0, 255).astype(np.uint8)
    if len(frame.shape) == 2:
        frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

    # Display window
    cv2.imshow("Real-time Inference", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        cap.release()
        cv2.destroyAllWindows()
        exit(0)

# --- CONNECT ---
accl.connect_input(data_source)
accl.connect_output(process_output)

# Start asynchronous inference
accl.wait()
