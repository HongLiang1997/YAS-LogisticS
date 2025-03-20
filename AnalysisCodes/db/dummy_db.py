# Simulated Database with Class 1 having 2 trays
SIMULATED_DB = {
    "Class 1": {
        "Tray 1": {
            "items": ["charger_box", "sdcard_reader"],  # Items in Tray 1
            "status": True,  # Tray 1 is empty
            "bay_number": 101  # Bay number for Tray 1
        },
        "Tray 2": {
            "items": ["sdcard_reader", "rpi_box"],  # Items in Tray 2
            "status": False,  # Tray 2 is occupied
            "bay_number": 102  # Bay number for Tray 2
        }
    }
}