import cv2
import numpy as np
import matplotlib.pyplot as plt

def detect_boxes_and_items_from_webcam(output_path="detected_boxes.jpg"):
    # Open the webcam (0 is the default camera; use 1 or another index if needed)
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    plt.ion()  # Turn on interactive mode for live updating of the plot
    
    # Capture the first frame
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        cap.release()
        return

    # Copy the frame for later use
    image = frame.copy()
    original = image.copy()
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Threshold to create a binary image (black borders become white, white background becomes black)
    _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours for rectangular boxes
    boxes = []
    for contour in contours:
        approx = cv2.approxPolyDP(contour, 0.02 * cv2.arcLength(contour, True), True)
        if len(approx) == 4:  # Only consider rectangles
            x, y, w, h = cv2.boundingRect(approx)
            # Filter based on size (to exclude noise)
            if w > 50 and h > 50:  # Adjust based on box size
                boxes.append((x, y, w, h))
    
    # Sort boxes by position (optional, for consistent ordering)
    boxes = sorted(boxes, key=lambda b: (b[1], b[0]))  # Sort by y, then x
    
    results = []
    for idx, (x, y, w, h) in enumerate(boxes):
        # Crop each box slightly inside the border
        margin = 5  # Adjust margin as needed
        x1, y1 = x + margin, y + margin
        x2, y2 = x + w - margin, y + h - margin
        roi = original[y1:y2, x1:x2]
        
        # Check if there's an item in the box (non-white pixels)
        roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        
        # Set a stricter threshold for detecting non-white pixels
        _, binary_roi = cv2.threshold(roi_gray, 240, 255, cv2.THRESH_BINARY)  # White areas are 255
        
        # Count the number of non-white pixels (areas that aren't fully white)
        non_white_pixels = np.count_nonzero(binary_roi < 255)
        
        # Consider a box as having an item if there are more than a threshold number of non-white pixels
        threshold = 10  # Minimum non-white pixels to consider as an item
        has_item = non_white_pixels > threshold
        
        # Save result
        results.append((idx + 1, has_item))
        
        # Draw box and label
        color = (0, 255, 0) if has_item else (0, 0, 255)
        cv2.rectangle(image, (x, y), (x+w, y+h), color, 2)
        cv2.putText(image, f'Box {idx+1}', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    
    # Display the resulting image with detected boxes using matplotlib
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))  # Convert BGR to RGB for matplotlib
    plt.axis('off')  # Hide axes
    plt.draw()  # Update the plot
    plt.pause(0.01)  # Pause for a short time to update the plot

    # Save the resulting image to a file
    cv2.imwrite(output_path, image)
    print(f"Result saved to {output_path}")
    
    # Release the webcam and close the plot window
    cap.release()
    plt.ioff()  # Turn off interactive mode for matplotlib
    plt.close()  # Close the plot window

# Run the function to start the webcam and detect boxes/items
detect_boxes_and_items_from_webcam()
