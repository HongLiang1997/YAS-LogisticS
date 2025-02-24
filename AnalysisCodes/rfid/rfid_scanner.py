import sys

def simulate_rfid():
    """Simulate RFID scan and return RFID tag."""
    rfid_tag = "box_rfid_001"  # Simulated RFID tag
    return rfid_tag

if __name__ == "__main__":
    # Check if the script is called with arguments
    rfid_tag = simulate_rfid()
    # Return the RFID tag via sys.stdout
    sys.stdout.write(rfid_tag)  # This will return the RFID tag without printing it
