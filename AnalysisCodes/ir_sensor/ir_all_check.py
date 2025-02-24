import time

def detect_empty_bays():
    """Simulates IR sensor detection for two trays in a bay."""
    time.sleep(5)  # Simulate sensor delay
    
    # Simulate both trays being empty
    tray1_empty = True
    tray2_empty = True

    available_bays = []
    
    if tray1_empty:
        available_bays.append("Tray 1")
    if tray2_empty:
        available_bays.append("Tray 2")

    return available_bays

if __name__ == "__main__":
    available_bays = detect_empty_bays()  # Capture the return value
    print(", ".join(available_bays))  # Print trays as a comma-separated string
