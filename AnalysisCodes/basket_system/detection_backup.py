import cv2
from ultralytics import YOLO

# --------------------- SECTION: Real-time Object Detection Using YOLOv8 ---------------------

def identify_objects_yolo_from_webcam():
    # Load your trained YOLOv8 model
    model = YOLO("best.pt")  # Ensure best.pt is in the correct path

    # Open webcam for real-time detection
    cam = cv2.VideoCapture(0)  # Use the first available webcam
    if not cam.isOpened():
        print("Error: Could not open webcam.")
        return

    while True:
        ret, frame = cam.read()
        if not ret:
            print("Error: Failed to capture image.")
            break

        # Perform inference on the current frame
        results = model(frame, conf=0.6)  # Use a confidence threshold of 0.6

        # Draw boxes and labels around detected objects
        for result in results:
            boxes = result.boxes  # Get detected bounding boxes
            
            for box in boxes:
                # Get bounding box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                # Get confidence score
                confidence = box.conf[0].item()

                # Get class index and convert to label
                class_idx = int(box.cls[0].item())  
                label = model.names[class_idx]  # Get class name

                # Draw bounding box
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)  # Green color box
                
                # Draw label and confidence score
                text = f"{label}: {confidence:.2f}"
                cv2.putText(frame, text, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Display the frame with bounding boxes and labels
        cv2.imshow("YOLO Object Detection", frame)

        # Break loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the webcam and close all OpenCV windows
    cam.release()
    cv2.destroyAllWindows()

# --------------------- SECTION: Run the Process ---------------------

if __name__ == "__main__":
    identify_objects_yolo_from_webcam()