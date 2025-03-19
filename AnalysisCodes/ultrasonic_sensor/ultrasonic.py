import RPi.GPIO as GPIO
import time
import json
import requests
import threading
from db.dummy_db import SIMULATED_DB  # Import SIMULATED_DB from dummy_db.py

# Set up GPIO
GPIO.setmode(GPIO.BCM)

# Define GPIO pins for both sensors
TRIG1 = 17
ECHO1 = 22
TRIG2 = 27
ECHO2 = 23

# Set up GPIO pins
GPIO.setup(TRIG1, GPIO.OUT)
GPIO.setup(ECHO1, GPIO.IN)
GPIO.setup(TRIG2, GPIO.OUT)
GPIO.setup(ECHO2, GPIO.IN)

# Global list to store scanned tray items
scanned_items = {}

# Function to measure distance
def measure_distance(TRIG, ECHO):
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.2)

    GPIO.output(TRIG, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG, GPIO.LOW)

    pulse_start = 0
    pulse_end = 0
    timeout = time.time() + 1
    while GPIO.input(ECHO) == GPIO.LOW:
        pulse_start = time.time()
        if pulse_start > timeout:
            print("Timeout waiting for echo start")
            return None

    while GPIO.input(ECHO) == GPIO.HIGH:
        pulse_end = time.time()
        if pulse_end > timeout:
            print("Timeout waiting for echo end")
            return None

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    return distance

# Function to check if the tray is within range (3 cm) and validate
def check_tray_return(TRIG, ECHO, bay_name):
    print(f"Scanned Items: {scanned_items}")
    distance = measure_distance(TRIG, ECHO)
    if distance is not None:
        print(f"{bay_name} Distance: {distance} cm")
        if distance < 3:  # If tray is within 3 cm
            print(f"{bay_name} - Tray returned within range.")
            # Trigger validation logic here for this tray
            validate_tray_data(bay_name)
    return distance

def validate_tray_data(bay_name):
    print(f"Validating {bay_name} with scanned items...")

    # Retrieve the tray number (use bay_name as the key in scanned_items)
    for tray_number, items in scanned_items.items():
        print(f"Tray Number: {tray_number}")
        print(f"Items: {items}")

        # Simulate retrieving expected items from the database for this tray
        expected_items = SIMULATED_DB["Class 1"].get(tray_number, {}).get("items", [])

        print(f"Expected Items: {expected_items}")
        print(f"Scanned Items: {items}")

        # Validate if the scanned items exactly match the expected items
        if set(items) == set(expected_items):
            print(f"{tray_number} validation successful! Updating tray information.")
            
            # Update the tray status and bay_number in the simulated database
            SIMULATED_DB["Class 1"][tray_number]["status"] = True  # Tray status marked as borrowed
            SIMULATED_DB["Class 1"][tray_number]["bay_number"] = 103  # Example: Assign bay number 103
            print(f"Updated {tray_number} status and bay_number in the simulated database.")
            
        else:
            print(f"Validation failed: Items do not match for Tray {tray_number}.")

# Function to continuously measure distances and check for tray returns
def measure_distances():
    try:
        while True:
            # Measure distance for both sensors with a slight delay to avoid interference
            distance1 = measure_distance(TRIG1, ECHO1)
            if distance1 is not None:
                print(f"Bay 1 Sensor Distance: {distance1} cm")
                # Check if tray 1 is within range (3 cm)
                check_tray_return(TRIG1, ECHO1, "Bay 1 Sensor")

            time.sleep(0.05)  # Small delay to avoid overlap between sensors

            distance2 = measure_distance(TRIG2, ECHO2)
            if distance2 is not None:
                print(f"Bay 2 Sensor Distance: {distance2} cm")
                # Check if tray 2 is within range (3 cm)
                check_tray_return(TRIG2, ECHO2, "Bay 2 Sensor")

            time.sleep(1)  # Adjust this for how often you want the measurements

    except KeyboardInterrupt:
        print("Measurement stopped by user")
        GPIO.cleanup()  # Clean up GPIO pins on exit
