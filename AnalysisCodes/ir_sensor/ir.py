import time

def detect_object():
    """Simulates IR sensor detection after 5 seconds."""
    print("Waiting for sensor detection...")
    time.sleep(5)  # Wait for 5 seconds (simulate sensor delay)
    
    # Return True after 5 seconds to indicate detection
    return True

if __name__ == "__main__":
    # Call the sensor detection function
    sensor_status = detect_object()
    
    # Print the sensor status (True when detection occurs)
    if sensor_status:
        print("Object detected! Returning True.")
    else:
        print("No object detected.")
