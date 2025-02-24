import customtkinter as ctk
import subprocess
import threading
import cv2
import numpy as np
from PIL import Image, ImageTk
import json  # Assuming the database returns JSON formatted data
import time 

# Set UI Theme
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

# Define script paths
RFID_SCRIPT = "rfid/rfid_scanner.py"
CAMERA_SCRIPT = "basket_system/item_scanner.py"
FETCH_SCRIPT = "db/fetch.py"  # Path to the script that fetches data from the database
IR_SCRIPT = "ir_sensor/ir.py"
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
    text="Step 1: RFID", 
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
status_label = ctk.CTkLabel(right_frame, text="Place Tray on Scanner", font=("Arial", 18))
status_label.pack(pady=20)

# Progress Bar
progress = ctk.CTkProgressBar(right_frame, width=300)
progress.set(0)
progress.pack(pady=10)
# Start Button
start_button = ctk.CTkButton(right_frame, text="Start Process", command=lambda: run_rfid_scan())
start_button.pack(pady=20)

# Reset Button (Initially Hidden)
reset_button = ctk.CTkButton(right_frame, text="Reset Process", command=lambda: reset_ui())
reset_button.pack(pady=20)
reset_button.pack_forget()

# To show webcam feed - Initially hidden
canvas = ctk.CTkCanvas(right_frame, width=640, height=480)
canvas.pack(pady=10)
canvas.pack_forget()  # Hide it initially


def update_status(text, progress_value, color="white"):
    """Updates the UI status label, progress bar, and color"""
    status_label.configure(text=text, text_color=color)
    progress.set(progress_value)
    app.update()


def run_rfid_scan():
    """Runs the RFID scanner script and proceeds to the next step"""
    update_step_labels(1)  
    update_status("Scanning RFID...", 0.1, "cyan")
    
    def process():
        # Run the RFID script and capture the output
        result = subprocess.run(["python", RFID_SCRIPT], capture_output=True, text=True)
        
        # Assuming the RFID tag is printed by the script, we capture it
        rfid_tag = result.stdout.strip()  # Assuming the tag is printed directly
        
        if rfid_tag:
            update_status("RFID Detected!", 0.2, "green")
            # Pass the rfid_tag to run_fetch_data
            app.after(1000, run_fetch_data, rfid_tag)  # Delay before fetching data
        else:
            update_status("RFID Scan Failed! Try Again.", 0.0, "red")
    
    threading.Thread(target=process, daemon=True).start()


def run_fetch_data(rfid_tag):
    """Fetches data from the database based on the RFID tag and proceeds to the next step"""
    update_step_labels(2)  
    update_status("Fetching Data...", 0.3, "cyan")
    
    def process():
        # Run the fetch data script with the rfid_tag
        result = subprocess.run(
            ["python", FETCH_SCRIPT, rfid_tag],  # Pass RFID tag as argument
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
            run_rfid_scan()  # Call the RFID scanning function again (adjust this as per your logic)
    
    threading.Thread(target=process, daemon=True).start()

def return_tray():
    """Simulate returning the tray (IR_SCRIPTS)."""
    update_step_labels(4)  

    update_status("Returning Tray...", 0.85, "blue")
    
    try:
        # Simulate the process of returning the tray by calling the IR_SCRIPTS
        result = subprocess.run(
            ["python", IR_SCRIPT],  # Replace with actual path to the script
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