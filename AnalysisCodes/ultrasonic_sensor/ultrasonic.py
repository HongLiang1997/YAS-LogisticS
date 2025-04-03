import RPi.GPIO as GPIO
import time
import json
import requests
import os
from db.dummy_db import SIMULATED_DB  # Import SIMULATED_DB from dummy_db.py
import threading

# Set up GPIO
GPIO.setmode(GPIO.BCM)

# Global list to store scanned tray items
scanned_items = {}

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

# Function to measure distance
def measure_distance(TRIG, ECHO):
    GPIO.output(TRIG, GPIO.LOW)
    time.sleep(0.2)

    GPIO.output(TRIG, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG, GPIO.LOW)

    pulse_start = time.time()
    timeout = time.time() + 1
    while GPIO.input(ECHO) == GPIO.LOW:
        pulse_start = time.time()
        if pulse_start > timeout:
            return None

    pulse_end = time.time()
    while GPIO.input(ECHO) == GPIO.HIGH:
        pulse_end = time.time()
        if pulse_end > timeout:
            return None

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    return round(distance, 2)

# Function to check tray presence and determine loan/return
def check_tray_status(TRIG, ECHO, bay_name, tray_id):
    print(f"Checking {bay_name}...")
    distance = measure_distance(TRIG, ECHO)
    if distance is not None:
        print(f"{bay_name} Distance: {distance} cm")
        if distance < 5:
            print(f"{bay_name} - Tray detected. Validating return...")
            validate_tray_data(tray_id)
        else:
            print(f"{bay_name} - Tray not detected. Notifying loan...")
            notify_tray_loan(tray_id)

def validate_tray_data(tray_id, scanned_items=None):
    # Retrieve tray data from simulated DB using tray_id
    tray_data = SIMULATED_DB["Class 1"].get(tray_id, None)
    
    if tray_data:
        # Extract expected items from the database for this tray
        expected_items = tray_data.get("items", [])
        
        if scanned_items:
            # Validate if the scanned items match the expected items
            print(f"Validating Tray {tray_id} with scanned items...")
            print(f"Scanned Items: {scanned_items}")
            print(f"Expected Items: {expected_items}")
            
            # Validate if the scanned items exactly match the expected items
            if set(scanned_items) == set(expected_items):
                print(f"Validation successful for Tray {tray_id}.")
                
                # Update tray status in the simulated database
                SIMULATED_DB["Class 1"][tray_id]["status"] = True  # Tray status marked as returned
                SIMULATED_DB["Class 1"][tray_id]["bay_number"] = 103  # Example: Assign new bay number
                print(f"Updated {tray_id} status and bay_number in the simulated database.")
                
                # Return tray information to API
                return_tray_to_api(tray_data["bay_number"], tray_data["items"])
            else:
                print(f"Validation failed: Scanned items do not match expected items for Tray {tray_id}.")
        else:
            # If no scanned items are provided, just mark as returned and update the status
            print(f"Validation successful for Tray {tray_id} without scanned items. Updating status...")
            SIMULATED_DB["Class 1"][tray_id]["status"] = True  # Mark as returned
            return_tray_to_api(tray_data["bay_number"], tray_data["items"])
    else:
        print(f"Validation failed: No matching tray found for Tray {tray_id}.")


# Function to notify API about tray loan
def notify_tray_loan(tray_id):
    tray_data = SIMULATED_DB["Class 1"].get(tray_id, None)
    if tray_data:
        url = "https://yas-logi.crabdance.com/api/edge/tray/loan"
        data = {"id": int(tray_data["bay_number"])}  # bay_number is used as bay_id
        send_api_request_async(url, data)  # Use the non-blocking version

# Function to notify API about tray return
def return_tray_to_api(bay_id, item_names):
    url = "https://yas-logi.crabdance.com/api/edge/tray/return"
    data = {"bayID": int(bay_id), "itemNames": item_names}
    send_api_request_async(url, data)  # Use the non-blocking version

# Function to send API request in a separate thread
def send_api_request_async(url, data):
    def async_request():
        json_data = json.dumps(data)
        bearer_token = "LongLongMan123"

        if not bearer_token:
            raise ValueError("Bearer token not found in environment variables")

        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {bearer_token}"}

        # Debug: Print what is being sent
        print(f"Sending API Request: {url} with data {json_data}")

        response = requests.put(url, data=json_data, headers=headers)
        print(f"API Response: {response.status_code}, {response.text}")  # Print response
    
    # Start the API request in a separate thread
    threading.Thread(target=async_request, daemon=True).start()

# Function to continuously check sensors
def measure_distances():
    try:
        while True:
            check_tray_status(TRIG1, ECHO1, "Bay 4 Sensor", "Tray 1")
            time.sleep(1)
            check_tray_status(TRIG2, ECHO2, "Bay 5 Sensor", "Tray 2")
            time.sleep(3)
    except KeyboardInterrupt:
        print("Measurement stopped by user")
        GPIO.cleanup()

# Start the measurement process in a separate thread
def start_measurement_thread():
    measurement_thread = threading.Thread(target=measure_distances, daemon=True)
    measurement_thread.start()

# Start measuring distances
start_measurement_thread()