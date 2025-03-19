import time
from dummy_db import SIMULATED_DB  # Import SIMULATED_DB from dummy_db.py

def query_db_for_tray_status(class_name):
    """Simulate querying a database with a dynamic table name (room name)."""
    time.sleep(2)  # Simulate database query delay
    
    # Simulate dynamic table query using class_name as the table
    if class_name in SIMULATED_DB:
        return SIMULATED_DB[class_name]  # Return tray status for the class
    
    print(f"Room {class_name} not found in the database.")
    return None

def detect_empty_bays(class_name):
    """Detect empty trays in the specified room by querying the simulated database."""
    trays = query_db_for_tray_status(class_name)  # Query the database for the tray status
    
    if trays is None:
        return []  # Return empty if room not found or no data
    
    # Check which trays are empty (status == True means empty)
    available_bays = [tray for tray, tray_info in trays.items() if tray_info["status"]]
    
    return available_bays

if __name__ == "__main__":
    class_name = "Class 1"  # Example room name
    
    # Fetch available bays for the specified room
    available_bays = detect_empty_bays(class_name)
    print(", ".join(available_bays))  # Print trays as a comma-separated string
