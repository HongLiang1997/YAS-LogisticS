import customtkinter as ctk
import subprocess
import threading
import cv2
import numpy as np
from PIL import Image, ImageTk
import json  # Assuming the database returns JSON formatted data
from beacon import triangulate  # Import the Bluetooth scanning function

# Thread for running Bluetooth scan
def run_bluetooth_thread():
    triangulate.start_bluetooth_scanning()  # Start Bluetooth scanning in the background

# Create and start a thread for Bluetooth scanning
bluetooth_thread = threading.Thread(target=run_bluetooth_thread, daemon=True)
bluetooth_thread.start()

# Set UI Theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Define script paths
CAMERA_SCRIPT = "basket_system/item_scanner.py"
FETCH_SCRIPT = "db/fetch.py"  # Path to the script that fetches data from the database
IR_SCRIPT_SPECIFIC = "ir_sensor/ir_specific_check.py"
IR_SCRIPT_ALL = "ir_sensor/ir_all_check.py"
BLUETOOTH_SCRIPT = "beacon/triangulate.py"
PYTHON_EXEC = "/home/yasuser/project/yas/bin/python3"  # Use the correct Python

# Create Main App
app = ctk.CTk()
app.title("Return Tray Process")
app.geometry("1200x800")  # Wider to accommodate both sections

# Left Panel for Steps
steps_frame = ctk.CTkFrame(app, width=400, height=800, corner_radius=15)  # Optional rounded corners
steps_frame.pack(side="left", fill="y")

# Status labels for each step (with improved styling)
step1_label = ctk.CTkLabel(
    steps_frame, 
    text="Step 1: Tray Selection", 
    font=("Arial", 20, "bold"),  # Larger and bold font
    text_color="white",  # Text color
    corner_radius=10,  # Rounded corners for the label
    fg_color="gray",  # Background color for the label
    width=180,  # Set a fixed width
    height=50,  # Set a fixed height for uniform size
    anchor="center"  # Center the text
)
step1_label.pack(pady=15)

step2_label = ctk.CTkLabel(
    steps_frame, 
    text="Step 2: Fetch Data", 
    font=("Arial", 20, "bold"),
    text_color="white",
    corner_radius=10,
    fg_color="gray",
    width=180,
    height=50,
    anchor="center"
)
step2_label.pack(pady=15)

step3_label = ctk.CTkLabel(
    steps_frame, 
    text="Step 3: Scan Item", 
    font=("Arial", 20, "bold"),
    text_color="white",
    corner_radius=10,
    fg_color="gray",
    width=180,
    height=50,
    anchor="center"
)
step3_label.pack(pady=15)

# New Step for fetching data from the database
step4_label = ctk.CTkLabel(
    steps_frame, 
    text="Step 4: Return Tray", 
    font=("Arial", 20, "bold"),
    text_color="white",
    corner_radius=10,
    fg_color="gray",
    width=180,
    height=50,
    anchor="center"
)
step4_label.pack(pady=15)

# New Step for fetching data from the database
step5_label = ctk.CTkLabel(
    steps_frame, 
    text="Step 5: Confrim", 
    font=("Arial", 20, "bold"),
    text_color="white",
    corner_radius=10,
    fg_color="gray",
    width=180,
    height=50,
    anchor="center"
)
step5_label.pack(pady=15)

# Function to update the step labels' colors based on the current step
def update_step_labels(current_step):
    """Updates the colors of step labels based on the current step."""
    # Define default colors for inactive steps
    inactive_color = "gray"
    inactive_text_color = "white"
    
    # Reset all step labels to inactive style
    step1_label.configure(fg_color=inactive_color, text_color=inactive_text_color)
    step2_label.configure(fg_color=inactive_color, text_color=inactive_text_color)
    step3_label.configure(fg_color=inactive_color, text_color=inactive_text_color)
    step4_label.configure(fg_color=inactive_color, text_color=inactive_text_color)
    step5_label.configure(fg_color=inactive_color, text_color=inactive_text_color)

    # Update the current step to active style (green background and white text)
    if current_step == 1:
        step1_label.configure(fg_color="green", text_color="white")
    elif current_step == 2:
        step2_label.configure(fg_color="green", text_color="white")
    elif current_step == 3:
        step3_label.configure(fg_color="green", text_color="white")
    elif current_step == 4:
        step4_label.configure(fg_color="green", text_color="white")
    elif current_step == 5:
        step5_label.configure(fg_color="green", text_color="white")


# Right Panel for Buttons, Progress, and Webcam Feed
right_frame = ctk.CTkFrame(app, width=800, height=800)
right_frame.pack(side="right", fill="both", expand=True)

# Status Label
status_label = ctk.CTkLabel(right_frame, text="Press Start Process to Begin", font=("Arial", 18))
status_label.pack(pady=20)

# Progress Bar
progress = ctk.CTkProgressBar(right_frame, width=300)
progress.set(0)
progress.pack(pady=10)
# Start Button
start_button = ctk.CTkButton(right_frame, text="Start Process", command=lambda: run_bay_check_scan())
start_button.pack(pady=20)

# Reset Button (Initially Hidden)
reset_button = ctk.CTkButton(right_frame, text="Reset Process", command=lambda: reset_ui())
reset_button.pack(pady=20)
reset_button.pack_forget()

# To show webcam feed - Initially hidden
canvas = ctk.CTkCanvas(right_frame, width=640, height=480)
canvas.pack(pady=10)
canvas.pack_forget()  # Hide it initially

import subprocess
import threading
import time


def update_status(text, progress_value, color="white"):
    """Updates the UI status label, progress bar, and color"""
    status_label.configure(text=text, text_color=color)
    progress.set(progress_value)
    app.update()


## Function to run the bay check scan
def run_bay_check_scan():
    """Runs the bay check script and updates UI with available trays."""
    update_status("Scanning for available bays...", 0.2, "cyan")
    start_button.pack_forget()
    def process():
        result = subprocess.run([PYTHON_EXEC, IR_SCRIPT_ALL], capture_output=True, text=True)
        
        available_bays = result.stdout.strip().split(", ") if result.stdout.strip() else []

        if available_bays:
            update_status("Available bays detected!", 0.3, "green")
            app.after(1000, lambda: generate_tray_buttons(available_bays))  # Pass available trays
        else:
            update_status("No available bays found!", 0.0, "red")

    threading.Thread(target=process, daemon=True).start()

# Frame to hold tray selection buttons
tray_frame = ctk.CTkFrame(right_frame)
tray_frame.pack(pady=10)

def generate_tray_buttons(tray_list):
    """Dynamically creates buttons for selecting available trays."""
    for widget in tray_frame.winfo_children():
        widget.destroy()  # Clear previous buttons

    if tray_list:
        for tray in tray_list:
            btn = ctk.CTkButton(tray_frame, text=f"{tray}", command=lambda t=tray: on_tray_selected(t),
            font=("Arial", 20, "bold"),
            text_color="white",
            corner_radius=10,
            width=180,
            height=50,)
            btn.pack(pady=5)
    else:
        no_tray_label = ctk.CTkLabel(tray_frame, text="No available trays.", text_color="red")
        no_tray_label.pack()

selected_tray_label = ctk.CTkLabel(right_frame, text="Selected Tray: None", font=("Arial", 16))
selected_tray_label.pack(pady=5)

def on_tray_selected(tray):
    """Updates the UI to show the selected tray and fetches data."""
    selected_tray_label.configure(text=f"Selected Tray: {tray}", text_color="lightblue")

    # Hide the tray selection frame
    tray_frame.pack_forget()

    # Proceed to fetch data for the selected tray
    update_status(f"Fetching data for {tray}...", 0.4, "cyan")
    run_fetch_data(tray)


def run_fetch_data(bay_number):
    """Fetches data from the database based on the RFID tag and proceeds to the next step"""
    update_step_labels(2)  
    update_status("Fetching Data...", 0.3, "cyan")
    
    def process():
        # Run the fetch data script with the rfid_tag
        result = subprocess.run(
            [PYTHON_EXEC, FETCH_SCRIPT, bay_number],  # Pass RFID tag as argument
            capture_output=True,
            text=True
        )
        
        try:
            fetched_data = json.loads(result.stdout)  # Assuming the output is JSON data
            
            if fetched_data:
                update_status("Data Fetched!", 0.4, "green")
                app.after(1000, run_camera_scan, fetched_data)  # Pass fetched data to the camera scan
            else:
                update_status("No Data Found! Try Again.", 0.0, "red")
        except json.JSONDecodeError:
            update_status("Error Fetching Data. Try Again.", 0.0, "red")
    
    threading.Thread(target=process, daemon=True).start()


def run_camera_scan(fetched_data):
    """Runs the camera scanner script with the fetched data"""
    update_step_labels(3)  
    update_status("Booting Up Camera...", 0.5, "cyan")
    
    # Show the webcam feed canvas after data is fetched
    canvas.pack()

    def process():
        from basket_system.item_scanner import identify_objects_yolo_from_webcam
       
        print("Starting scan...")
        # Call the function from item_scanner.py to start the scanning process
        scan_result = identify_objects_yolo_from_webcam(update_status, canvas, fetched_data)
        
        if scan_result:
            print("Scan successful.")
            update_status("Scan successful, proceeding to Return Tray.", 0.75, "green")
            canvas.pack_forget()  # Hide it initially            
            return_tray()  # You can modify this part as per your logic
        else:
            print("Scan failed, retrying...")
            update_status("Scan Failed, retrying...", 0.0, "red")
            canvas.pack_forget()  # Hide it initially
            run_bay_check_scan()  # Call the RFID scanning function again (adjust this as per your logic)
    
    threading.Thread(target=process, daemon=True).start()

def return_tray():
    """Simulate returning the tray (IR_SCRIPTS)."""
    update_step_labels(4)  

    update_status("Returning Tray...", 0.85, "blue")
    
    try:
        # Simulate the process of returning the tray by calling the IR_SCRIPTS
        result = subprocess.run(
            [PYTHON_EXEC, IR_SCRIPT_SPECIFIC],  # Replace with actual path to the script
            capture_output=True,
            text=True
        )
        
        # Check if the script ran successfully
        if result.returncode == 0:
            update_status("Tray Returned Successfully!", 0.9, "green")
            complete()
        else:
            update_status("Error in Returning Tray.", 0.0, "red")
    
    except Exception as e:
        update_status(f"Error: {str(e)}", 0.0, "red")

        
def complete():
    """Complete function that concludes the process and lets the user return to RFID scan."""
    update_step_labels(5)  # Mark the final step as complete.
    
    update_status("Process complete.", 1.0, "green")  # Update UI with complete status.

    # Show a button to allow the user to go back to the RFID scan stage
    show_reset_button()

def show_reset_button():
    """Shows Reset Button to restart the process"""
    start_button.pack_forget()
    reset_button.pack(pady=20)

def reset_ui():
    """Resets the UI for a new cycle"""
    reset_button.pack_forget()
    start_button.pack(pady=20)
    update_status("Place Tray on Scanner", 0.0, "white")
    step1_label.configure(text="Step 1: RFID", text_color="white")
    step2_label.configure(text="Step 2: Fetch Data", text_color="white")
    step3_label.configure(text="Step 3: Scan Item", text_color="white")
    step4_label.configure(text="Step 4: Return Tray", text_color="white")
    step5_label.configure(text="Step 5: Confirm", text_color="white")
    canvas.pack_forget()  # Hide the webcam feed on reset


# Run Main Loop
app.mainloop()