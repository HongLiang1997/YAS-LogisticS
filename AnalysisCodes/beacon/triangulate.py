import numpy as np
from bluepy.btle import Scanner, DefaultDelegate
import time
from scipy.optimize import least_squares

# Constants and beacon definitions
KNOWN_BEACONS = {
    "d1:6a:3b:b4:f6:47": (0, 0),  # Beacon 1 Bottom left
    "ee:8d:95:b2:16:42": (5, 0),  # Beacon 2 Bottom right
    "f4:7d:ee:dc:b8:5c": (0, 5),  # Beacon 3 Top left
    "fd:4d:6b:06:3d:1e": (5, 5),  # Beacon 4 Top right
}

UNKNOWN_BEACONS = {
    "f6:5b:d3:35:e4:91",  # Beacon 5 Position unknown
    "c0:3b:fc:7b:f4:52",  # Beacon 6 Position unknown
}

TX_Power = -72  # Adjust TX power if needed
ENV_Factor = 2.5  # Adjust environment factor based on the environment

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

def get_distance(rssi, tx_power=TX_Power, n=ENV_Factor):
    """Calculate distance from RSSI"""
    distance = 10 ** ((tx_power - rssi) / (10 * n))
    return min(distance, 20)  # Cap at 20m to prevent overflow

def scan_beacon(scan_time=10):
    """Scan for Bluetooth devices and get their distances"""
    print("Scanning for Bluetooth devices...")
    scanner = Scanner().withDelegate(ScanDelegate())
    devices = scanner.scan(scan_time)
    
    known_devices = set()
    unknown_devices = set()
    known_distance = {}
    unknown_distance = {}
    
    print("Scan Complete.")
    
    for dev in devices:
        # Only add devices that are in the KNOWN_BEACONS or UNKNOWN_BEACONS
        if dev.addr in KNOWN_BEACONS:
            known_devices.add(dev.addr)
            rssi = dev.rssi
            distance = get_distance(rssi)
            known_distance[dev.addr] = distance
            print(f"Known device {dev.addr} detected with RSSI: {rssi}, Distance: {distance:.2f}m")
        elif dev.addr in UNKNOWN_BEACONS:
            unknown_devices.add(dev.addr)
            rssi = dev.rssi
            distance = get_distance(rssi)
            unknown_distance[dev.addr] = distance
            print(f"Unknown device {dev.addr} detected with RSSI: {rssi}, Distance: {distance:.2f}m")
    
    return known_devices, unknown_devices, known_distance, unknown_distance

def triangulate(beacon_distances):
    """Estimate the position of an unknown beacon based on known beacons"""
    num_beacons = len(beacon_distances)
    
    if num_beacons < 2:
        print("Less than 2 beacons known positioned detected")
        return None
    
    beacon_positions = np.array([KNOWN_BEACONS[mac] for mac in beacon_distances.keys()])
    distances = np.array(list(beacon_distances.values()))
    
    if num_beacons == 2:
        (x1, y1), (x2, y2) = beacon_positions
        d1, d2 = distances
        
        # Apply a higher weight for the beacon with a shorter distance to reduce ambiguity
        weight1 = 1 / (d1 + 1e-6)
        weight2 = 1 / (d2 + 1e-6)
        x = (x1 * weight1 + x2 * weight2) / (weight1 + weight2)
        y = (y1 * weight1 + y2 * weight2) / (weight1 + weight2)
        
        return np.array([x, y])
    
    else:
        def error_function(position, beacons, distances):
            x, y = position
            return [np.sqrt((x - bx)**2 + (y - by)**2) - d for (bx, by), d in zip(beacons, distances)]
        
        # Solve using least squares fitting for better precision when there are more than 2 beacons
        initial_guess = np.mean(beacon_positions, axis=0)
        result = np.linalg.lstsq(
            np.column_stack([2 * (beacon_positions[:, 0] - beacon_positions[0, 0]),
                             2 * (beacon_positions[:, 1] - beacon_positions[0, 1])]),
            distances**2 - distances[0]**2 + beacon_positions[:, 0]**2 - beacon_positions[0, 0]**2 +
            beacon_positions[:, 1]**2 - beacon_positions[0, 1]**2,
            rcond=None
        )[0]
        
        return result.flatten()

def start_bluetooth_scanning():
    """Start continuous Bluetooth scanning and triangulation"""
    while True:
        # Scan for devices
        known_devices, unknown_devices, known_distance, unknown_distance = scan_beacon(scan_time=10)
        
        # Print only the MAC addresses of known and unknown devices
        if known_devices:
            print("Known Devices Detected:")
            for mac in known_devices:
                print(f"  - {mac}")
        
        if unknown_devices:
            print("Unknown Devices Detected:")
            for mac in unknown_devices:
                print(f"  - {mac}")
        
        # If there are at least 2 known beacons, try to estimate the position of unknown beacons
        if len(known_distance) >= 2:
            for unknown_mac in unknown_distance:
                estimated_position = triangulate(known_distance)
                if estimated_position is not None:
                    print(f"Estimated location of beacon {unknown_mac} is at X:{estimated_position[0]:.2f}, Y:{estimated_position[1]:.2f}m")
                else:
                    print(f"Not enough beacons detected for {unknown_mac}")
        else:
            print("Not enough known beacons detected")
        
        # Wait a bit before scanning again (optional)
        time.sleep(10)  # Sleep for 10 seconds before the next scan cycle