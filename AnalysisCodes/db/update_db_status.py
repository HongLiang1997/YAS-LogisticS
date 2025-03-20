import RPi.GPIO as GPIO
import time

# Set up GPIO
GPIO.setmode(GPIO.BCM)

# Define GPIO pins for both sensors
TRIG1 = 17  # Sensor for Tray 1
ECHO1 = 22
TRIG2 = 27  # Sensor for Tray 2 (if needed)
ECHO2 = 23

# Set up GPIO pins
GPIO.setup(TRIG1, GPIO.OUT)
GPIO.setup(ECHO1, GPIO.IN)
GPIO.setup(TRIG2, GPIO.OUT)
GPIO.setup(ECHO2, GPIO.IN)

# Function to measure distance
def measure_distance(TRIG, ECHO):
    """Measure distance using the ultrasonic sensor."""
    # Ensure the trigger is LOW
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.2)
    
    # Send a pulse to trigger the sensor
    GPIO.output(TRIG, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG, GPIO.LOW)
    
    # Initialize variables for pulse timing
    pulse_start = 0
    pulse_end = 0
    
    # Wait for the echo to be received with timeout
    timeout = time.time() + 1  # 1 second timeout for waiting for the echo
    while GPIO.input(ECHO) == GPIO.LOW:
        pulse_start = time.time()
        if pulse_start > timeout:
            print("Timeout waiting for echo start")
            return None
    
    # Wait for the echo to go HIGH
    while GPIO.input(ECHO) == GPIO.HIGH:
        pulse_end = time.time()
        if pulse_end > timeout:
            print("Timeout waiting for echo end")
            return None
    
    # Calculate the distance
    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Speed of sound in cm/s (distance in cm)
    distance = round(distance, 2)  # Round to 2 decimal places
    
    return distance

# Function to detect tray return by measuring distance
def check_tray_return(sensor_trigger, sensor_echo, tray_name="Tray"):
    """Check if a tray has been returned based on ultrasonic sensor distance."""
    distance = measure_distance(sensor_trigger, sensor_echo)
    
    if distance is not None:
        # Define a threshold for when the tray is considered returned (e.g., within 10 cm)
        threshold_distance = 10  # cm, adjust based on your setup
        
        if distance < threshold_distance:
            print(f"{tray_name} has been returned!")
            return True
        else:
            print(f"{tray_name} not returned yet. Current distance: {distance} cm")
            return False
    else:
        print("Error measuring distance")
        return False

# Function to check both trays for return status
def check_all_trays_return():
    """Check the return status for both trays and proceed when both are returned."""
    try:
        tray1_returned = False
        tray2_returned = False

        while not (tray1_returned and tray2_returned):
            # Check if Tray 1 is returned
            tray1_returned = check_tray_return(TRIG1, ECHO1, "Tray 1")
            
            # If Tray 1 is returned, print and proceed
            if tray1_returned:
                print("Tray 1 returned successfully!")
            
            time.sleep(0.05)  # Small delay to avoid overlap between sensors
            
            # Check if Tray 2 is returned (if you have a second tray)
            tray2_returned = check_tray_return(TRIG2, ECHO2, "Tray 2")
            
            # If Tray 2 is returned, print and proceed
            if tray2_returned:
                print("Tray 2 returned successfully!")
            
            time.sleep(1)  # Adjust this for how often you want to check the trays
        
        print("Both trays have been returned. Proceeding to next step.")
                
    except KeyboardInterrupt:
        print("Measurement stopped by user")
        GPIO.cleanup()  # Clean up GPIO pins on exit

if __name__ == "__main__":
    check_all_trays_return()
