import cv2
from ultralytics import YOLO
import tkinter as tk
from PIL import Image, ImageTk
import time
import threading

def identify_objects_yolo_from_webcam(update_status_callback, canvas, target_labels):
    """Identifies objects using YOLOv8 and calls the update_status_callback to update the UI."""
    model = YOLO("basket_system/best.pt")  # Load the trained YOLOv8 model
    cam = cv2.VideoCapture(0)  # Open webcam
    if not cam.isOpened():
        update_status_callback("ERROR: Could not open webcam.", 0.0, "red")
        return False  # Return False in case of an error

    detected_objects = {"charger_box": False, "sdcard_reader": False}  # Track detection status for both objects
    last_detection_time = 0  # To track when both objects were last detected
    detection_duration = 5  # Time (in seconds) both objects should be detected for
    
    frame_count = 0
    detection_threshold = 5  # Process every 5th frame to reduce load
    scan_complete = False  # Flag to control the flow and stop recursion

    update_status_callback(f"Scanning items...", 0.6, "cyan")

    def show_frame():
        """Captures frames from the webcam and updates the tkinter canvas."""
        nonlocal frame_count, last_detection_time, scan_complete
        if scan_complete:
            return  # Exit recursion once scan is complete

        ret, frame = cam.read()
        if not ret:
            update_status_callback("ERROR: Failed to capture image.", 0.0, "red")
            cam.release()
            return False
        
        # Perform inference
        results = model(frame, conf=0.7)
        detected_labels = []  # List to accumulate detected labels
        # Detect objects and draw bounding boxes
        for result in results:
            boxes = result.boxes  # Get detected bounding boxes
            for box in boxes:
                # Get class name
                class_idx = int(box.cls[0].item())  
                label = model.names[class_idx]  # Get class name
                confidence = box.conf[0].item()  # Get confidence score

                # Check if the detected label is one of the target labels
                if label in target_labels:
                    # Draw a green bounding box around the detected object
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

                    # Draw the label and confidence score
                    text = f"{label}: {confidence:.2f}"
                    cv2.putText(frame, text, (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    # Accumulate the detected labels
                    detected_labels.append(label)

                    # Set the object as detected (if it's not already)
                    detected_objects[label] = True

        # Convert frame to RGB (tkinter needs it in RGB)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        photo = ImageTk.PhotoImage(image=Image.fromarray(frame_rgb))
         # Update the canvas with the new frame
        canvas.create_image(0, 0, image=photo, anchor="nw")
        canvas.image = photo  # Keep a reference to the image

        # Display the list of detected labels in the status message
        if detected_labels:
            update_status_callback(f"Detected items: {', '.join(detected_labels)}", 0.65, "cyan")

        # Check if both objects are detected
        if all(detected_objects.values()):
            # If both objects are detected, check if they've been detected for at least 5 seconds
            if last_detection_time == 0:
                # Record the first time both objects were detected
                last_detection_time = time.time()
                print("Both objects detected for the first time.")
            
            elif time.time() - last_detection_time >= detection_duration:
                # If 5 seconds have passed, mark scan as complete and update status
                update_status_callback("Both objects detected for 5 seconds. Proceeding to next step...", 0.7, "green")
                scan_complete = True  # Set the flag to stop the loop
                cam.release()

        # Keep updating the frame until scan is complete
        if not scan_complete:
            canvas.after(10, show_frame)

    # Start the webcam feed on the tkinter canvas
    show_frame()

    # Blocking until scan completes or is canceled
    while not scan_complete:
        time.sleep(0.1)  # Check for completion every 100ms

    return scan_complete  # Return the scan result once completed