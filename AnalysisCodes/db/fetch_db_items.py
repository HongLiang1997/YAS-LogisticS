import sys
import json
from dummy_db import SIMULATED_DB  # Import the simulated database

def prep_data(tray_number):
    """Extract items from the specified tray in the database."""
    for class_name, trays in SIMULATED_DB.items():
        if tray_number in trays:
            return trays[tray_number]["items"]  # Return only the items in the tray

    return {"error": "Tray not found"}  # If tray is not found

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Tray number not provided.")
        sys.exit(1)

    tray_number = sys.argv[1]  # The tray number passed as argument
    data = prep_data(tray_number)  # Fetch the items in the tray
    print(json.dumps(data))  # Output data as JSON
