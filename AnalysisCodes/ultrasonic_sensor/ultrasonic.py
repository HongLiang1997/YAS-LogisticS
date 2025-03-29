import RPi.GPIO as GPIO
import time
import json
import requests
import os
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
        if distance < 3:
            print(f"{bay_name} - Tray detected. Validating return...")
            validate_tray_data(tray_id)
        else:
            print(f"{bay_name} - Tray not detected. Notifying loan...")
            notify_tray_loan(tray_id)

# Function to validate tray data and communicate with API
def validate_tray_data(tray_id):
    tray_data = SIMULATED_DB["Class 1"].get(tray_id, None)
    if tray_data:
        print(f"Validation successful for {tray_id}. Updating status...")
        SIMULATED_DB["Class 1"][tray_id]["status"] = True
        return_tray_to_api(tray_data["bay_number"], tray_data["items"])
    else:
        print(f"Validation failed: No matching tray found.")

# Function to notify API about tray loan
def notify_tray_loan(tray_id):
    tray_data = SIMULATED_DB["Class 1"].get(tray_id, None)
    if tray_data:
        url = "http://yas-logi.crabdance.com/api/edge/tray/loan"
        data = {"id": tray_data["bay_number"]}  # bay_number is used as bay_id
        send_api_request(url, data)

# Function to notify API about tray return
def return_tray_to_api(bay_id, item_names):
    url = "http://yas-logi.crabdance.com/api/edge/tray/return"
    data = {"bayID": bay_id, "itemNames": item_names}
    send_api_request(url, data)

# Function to send API request
def send_api_request(url, data):
    json_data = json.dumps(data)
    bearer_token = os.getenv("BEARER_TOKEN")
    if not bearer_token:
        raise ValueError("Bearer token not found in environment variables")
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {bearer_token}"}
    response = requests.put(url, data=json_data, headers=headers)
    print(f"API Response: {response.status_code}, {response.text}")

# Function to continuously check sensors
def measure_distances():
    try:
        while True:
            check_tray_status(TRIG1, ECHO1, "Bay 1 Sensor", "Tray 1")
            time.sleep(0.5)
            check_tray_status(TRIG2, ECHO2, "Bay 2 Sensor", "Tray 2")
            time.sleep(1)
    except KeyboardInterrupt:
        print("Measurement stopped by user")
        GPIO.cleanup()

# Start measuring distances
measure_distances()
