import sys
import json

def prep_data(tray_number):
    """Simulate preparing data based on the RFID tag from a 'database' with fragmented data."""
    # Simulate the database as a mapping of RFID tags to a list of item types
    simulated_database = {
        "Tray 1": ["charger_box", "sdcard_reader"],
        "Tray 2": ["sdcard_reader", "rpi_box"],
    }

    # If the RFID tag exists in the simulated database
    if tray_number in simulated_database:
        item_list = simulated_database[tray_number]
        
        # Prepare a list of items with their availability marked as False (not available)
        prepared_data = {item: False for item in item_list}
        
        # Return the prepared data as a dictionary
        return prepared_data
    else:
        # If RFID tag is not found in the database
        return {"error": "RFID tag not found"}

# Main logic to handle the argument and return the data
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("RFID tag not provided.")
        sys.exit(1)

    tray_number = sys.argv[1]  # The RFID tag passed as argument
    data = prep_data(tray_number)  # Fetch the data based on the RFID tag
    print(json.dumps(data))  # Output data as JSON