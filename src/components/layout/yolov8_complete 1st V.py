import cv2
import os
import csv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import datetime, timedelta
from ultralytics import YOLO
from threading import Thread, Lock
from collections import defaultdict
from PIL import Image, ImageTk, ImageDraw
import queue

# Initialize YOLO model
model = YOLO("yolov8n.pt")

# CSV Configuration
csv_file_path = os.path.join(os.getcwd(), "entry_exit_log.csv")
if not os.path.exists(csv_file_path):
    with open(csv_file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["ID", "Event", "Timestamp", "Duration"])

# Email Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Global Variables
cap = None
tracking = False
thread = None
entry_count = 0
exit_count = 0
person_states = defaultdict(lambda: {
    "entered": False,
    "exited": False,
    "last_x": None,
    "entry_time": None,
    "exit_time": None,
    "duration": None
})
W, H = 640, 480  # Default camera resolution
frame_queue = queue.Queue(maxsize=1)
frame_lock = Lock()
update_interval = 30  # milliseconds (~33 FPS)

# ================== MAIN WINDOW ==================
window = tk.Tk()
window.title("German Future Tech (GFT)")
window.geometry("1100x850")
window.configure(bg="#f0f0f0")

# Configure grid weights for better layout
window.grid_columnconfigure(0, weight=1)
window.grid_rowconfigure(1, weight=1)

# ================== HEADER WITH LOGO ==================
header_frame = tk.Frame(window, bg="#333333", height=80)
header_frame.grid(row=0, column=0, sticky="ew", padx=0, pady=0)

try:
    logo_img = Image.open("ifactory_signature.jpg")
    logo_img = logo_img.resize((640, 70), Image.LANCZOS)
    logo_photo = ImageTk.PhotoImage(logo_img)
    logo_label = tk.Label(header_frame, image=logo_photo, bg="#333333")
    logo_label.image = logo_photo
    logo_label.pack(side=tk.LEFT, padx=20, pady=5)
except Exception as e:
    print(f"Error loading logo: {e}")
    logo_label = tk.Label(header_frame, text="iFactory3D", font=("Arial", 24, "bold"),
                          bg="#333333", fg="white")
    logo_label.pack(side=tk.LEFT, padx=20, pady=20)

# ================== MAIN CONTENT FRAME ==================
main_frame = tk.Frame(window, bg="#f0f0f0")
main_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)

# Left Panel - Video Feed
left_panel = tk.Frame(main_frame, width=640, height=480, bd=2, relief=tk.RIDGE, bg="black")
left_panel.grid(row=0, column=0, padx=10, pady=10, sticky="nsew")

video_label = tk.Label(left_panel, bg="black")
video_label.pack(fill=tk.BOTH, expand=True)

# Right Panel - Controls
right_panel = tk.Frame(main_frame, bg="#f0f0f0")
right_panel.grid(row=0, column=1, padx=10, pady=10, sticky="nsew")

# ================== CONTROL BUTTONS ==================
control_frame = tk.LabelFrame(right_panel, text=" Camera Controls ", font=("Arial", 10, "bold"),
                              bg="#f0f0f0", padx=10, pady=10)
control_frame.pack(fill=tk.X, padx=5, pady=5)

btn_start = tk.Button(control_frame, text="▶ Start Tracking", command=lambda: start_tracking(),
                      bg="#4CAF50", fg="white", font=("Arial", 10, "bold"), width=15)
btn_start.pack(side=tk.LEFT, padx=5, pady=5)

btn_stop = tk.Button(control_frame, text="■ Stop Tracking", command=lambda: stop_tracking(),
                     bg="#F44336", fg="white", font=("Arial", 10, "bold"), width=15, state=tk.DISABLED)
btn_stop.pack(side=tk.LEFT, padx=5, pady=5)

btn_view = tk.Button(control_frame, text="📊 View CSV", command=lambda: view_csv_log(),
                     bg="#2196F3", fg="white", font=("Arial", 10, "bold"), width=15)
btn_view.pack(side=tk.LEFT, padx=5, pady=5)

# ================== LINE CONTROLS ==================
line_frame = tk.LabelFrame(right_panel, text=" Line Positions ", font=("Arial", 10, "bold"),
                           bg="#f0f0f0", padx=10, pady=10)
line_frame.pack(fill=tk.X, padx=5, pady=5)

tk.Label(line_frame, text="Entry Line:", bg="#f0f0f0").pack()
entry_slider = tk.Scale(line_frame, from_=0, to=W, orient=tk.HORIZONTAL, length=300)
entry_slider.set(W // 3)
entry_slider.pack()

tk.Label(line_frame, text="Exit Line:", bg="#f0f0f0").pack()
exit_slider = tk.Scale(line_frame, from_=0, to=W, orient=tk.HORIZONTAL, length=300)
exit_slider.set(2 * W // 3)
exit_slider.pack()

# ================== COUNTERS ==================
counter_frame = tk.LabelFrame(right_panel, text=" Counters ", font=("Arial", 10, "bold"),
                              bg="#f0f0f0", padx=10, pady=10)
counter_frame.pack(fill=tk.X, padx=5, pady=5)

lbl_entry = tk.Label(counter_frame, text="Entries: 0", font=("Arial", 14, "bold"), bg="#f0f0f0")
lbl_entry.pack(pady=5)

lbl_exit = tk.Label(counter_frame, text="Exits: 0", font=("Arial", 14, "bold"), bg="#f0f0f0")
lbl_exit.pack(pady=5)

# ================== DATA EXPORT ==================
export_frame = tk.LabelFrame(right_panel, text=" Data Export ", font=("Arial", 10, "bold"),
                             bg="#f0f0f0", padx=10, pady=10)
export_frame.pack(fill=tk.X, padx=5, pady=5)

btn_export = tk.Button(export_frame, text="💾 Export CSV", command=lambda: export_csv(),
                       bg="#607D8B", fg="white", font=("Arial", 10, "bold"), width=15)
btn_export.pack(side=tk.LEFT, padx=5, pady=5)

btn_email = tk.Button(export_frame, text="✉ Email CSV", command=lambda: email_csv_dialog(),
                      bg="#9C27B0", fg="white", font=("Arial", 10, "bold"), width=15)
btn_email.pack(side=tk.LEFT, padx=5, pady=5)

# Initialize blank preview
blank_image = Image.new("RGB", (W, H), "black")
imgtk = ImageTk.PhotoImage(image=blank_image)
video_label.imgtk = imgtk
video_label.configure(image=imgtk)


# ================== VIDEO PROCESSING FUNCTIONS ==================
def update_slider_preview(_=None):
    """Update the lines on blank preview when sliders move"""
    if not tracking:
        img = blank_image.copy()
        draw = ImageDraw.Draw(img)
        draw.line([(entry_slider.get(), 0), (entry_slider.get(), H)], fill="green", width=2)
        draw.line([(exit_slider.get(), 0), (exit_slider.get(), H)], fill="red", width=2)
        imgtk = ImageTk.PhotoImage(image=img)
        video_label.imgtk = imgtk
        video_label.configure(image=imgtk)


entry_slider.config(command=update_slider_preview)
exit_slider.config(command=update_slider_preview)


def track_people():
    global entry_count, exit_count, tracking

    while tracking:
        try:
            ret, frame = cap.read()
            if not ret:
                print("Failed to capture frame")
                continue

            # Process frame
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)
            draw = ImageDraw.Draw(img)

            # Get current line positions
            entry_x = entry_slider.get()
            exit_x = exit_slider.get()

            # Draw lines
            draw.line([(entry_x, 0), (entry_x, H)], fill="green", width=2)
            draw.line([(exit_x, 0), (exit_x, H)], fill="red", width=2)

            # Process detections
            results = model.track(frame, persist=True, classes=[0], tracker="bytetrack.yaml")

            if results[0].boxes is not None and results[0].boxes.id is not None:
                boxes = results[0].boxes.xyxy.cpu().numpy()
                ids = results[0].boxes.id.cpu().numpy().astype(int)

                for box, track_id in zip(boxes, ids):
                    x1, y1, x2, y2 = box
                    center_x = int((x1 + x2) / 2)
                    state = person_states[track_id]

                    # Entry logic
                    if (state["last_x"] is not None and
                            state["last_x"] < entry_x <= center_x < exit_x and
                            not state["entered"]):
                        entry_count += 1
                        state["entered"] = True
                        state["exited"] = False
                        state["entry_time"] = datetime.now()
                        log_event(track_id, "Entry")
                        lbl_entry.config(text=f"Entries: {entry_count}")

                    # Exit logic
                    if (state["last_x"] is not None and
                            state["last_x"] < exit_x <= center_x and
                            state["entered"] and not state["exited"]):
                        exit_count += 1
                        state["exited"] = True
                        state["entered"] = False
                        state["exit_time"] = datetime.now()
                        if state["entry_time"]:
                            state["duration"] = state["exit_time"] - state["entry_time"]
                        log_event(track_id, "Exit")
                        lbl_exit.config(text=f"Exits: {exit_count}")

                    state["last_x"] = center_x

                    # Display ID and duration
                    display_text = f"ID: {track_id}"
                    if state["duration"]:
                        duration = state["duration"]
                        hours, remainder = divmod(duration.total_seconds(), 3600)
                        minutes, seconds = divmod(remainder, 60)
                        display_text += f"\n{int(hours)}h {int(minutes)}m {int(seconds)}s"
                    elif state["entered"] and state["entry_time"]:
                        current_duration = datetime.now() - state["entry_time"]
                        hours, remainder = divmod(current_duration.total_seconds(), 3600)
                        minutes, seconds = divmod(remainder, 60)
                        display_text += f"\n{int(hours)}h {int(minutes)}m {int(seconds)}s"

                    draw.rectangle([(x1, y1), (x2, y2)], outline="yellow", width=2)
                    draw.text((x1, y1 - 40), display_text, fill="white")

            # Only update if queue is empty to prevent backlog
            if frame_queue.empty():
                with frame_lock:
                    try:
                        frame_queue.put(img, block=False)
                    except queue.Full:
                        pass

        except Exception as e:
            print(f"Tracking error: {e}")
            continue


def update_display():
    try:
        if not frame_queue.empty():
            with frame_lock:
                try:
                    img = frame_queue.get_nowait()
                    imgtk = ImageTk.PhotoImage(image=img)
                    video_label.imgtk = imgtk
                    video_label.configure(image=imgtk)
                except queue.Empty:
                    pass
    except Exception as e:
        print(f"Display update error: {e}")

    if tracking:
        window.after(update_interval, update_display)


def start_tracking():
    global cap, tracking, thread, W, H

    if not tracking:
        tracking = True
        cap = cv2.VideoCapture(1, cv2.CAP_DSHOW)  # Use DirectShow for better compatibility

        if cap.isOpened():
            # Set camera properties
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            cap.set(cv2.CAP_PROP_FPS, 30)

            W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            entry_slider.config(to=W)
            exit_slider.config(to=W)

            btn_start.config(state=tk.DISABLED)
            btn_stop.config(state=tk.NORMAL)

            # Start processing thread
            thread = Thread(target=track_people, daemon=True)
            thread.start()

            # Start display updates
            window.after(update_interval, update_display)
        else:
            messagebox.showerror("Error", "Failed to open camera")
            tracking = False


def stop_tracking():
    global tracking, cap

    if tracking:
        tracking = False

        # Wait for thread to finish
        if thread is not None and thread.is_alive():
            thread.join(timeout=1)

        if cap is not None:
            cap.release()
            cap = None

        btn_start.config(state=tk.NORMAL)
        btn_stop.config(state=tk.DISABLED)
        update_slider_preview()


# ================== DATA LOGGING FUNCTIONS ==================
def log_event(person_id, event_type):
    timestamp = datetime.now()
    duration_str = ""

    if event_type == "Entry":
        person_states[person_id]["entry_time"] = timestamp
    elif event_type == "Exit":
        entry_time = person_states[person_id]["entry_time"]
        if entry_time:
            duration = timestamp - entry_time
            person_states[person_id]["duration"] = duration
            duration_str = str(duration)

    with open(csv_file_path, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            person_id,
            event_type,
            timestamp.strftime("%Y-%m-%d %H:%M:%S.%f"),
            duration_str
        ])


# ================== DATA VIEW/EXPORT FUNCTIONS ==================
def view_csv_log():
    top = tk.Toplevel(window)
    top.title("CSV Log Viewer")
    top.geometry("1000x600")

    frame = ttk.Frame(top)
    frame.pack(fill="both", expand=True, padx=10, pady=10)

    # Treeview with scrollbars
    scroll_y = ttk.Scrollbar(frame)
    scroll_y.pack(side="right", fill="y")

    scroll_x = ttk.Scrollbar(frame, orient="horizontal")
    scroll_x.pack(side="bottom", fill="x")

    tree = ttk.Treeview(frame, columns=("ID", "Event", "Timestamp", "Duration"), show="headings",
                        yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)

    # Configure columns
    tree.heading("ID", text="ID")
    tree.heading("Event", text="Event")
    tree.heading("Timestamp", text="Timestamp")
    tree.heading("Duration", text="Duration")

    tree.column("ID", width=80, anchor="center")
    tree.column("Event", width=80, anchor="center")
    tree.column("Timestamp", width=200, anchor="center")
    tree.column("Duration", width=150, anchor="center")

    tree.pack(fill="both", expand=True)

    scroll_y.config(command=tree.yview)
    scroll_x.config(command=tree.xview)

    # Load data with duration formatting
    try:
        with open(csv_file_path, newline='') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 3:
                    # Format duration for better readability
                    if len(row) > 3 and row[3]:
                        try:
                            parts = row[3].split(':')
                            if len(parts) == 3:
                                seconds_part = parts[2].split('.')[0]
                                row[3] = f"{parts[0]}h {parts[1]}m {seconds_part}s"
                        except:
                            pass
                    tree.insert("", "end", values=row[:4])
    except Exception as e:
        messagebox.showerror("Error", f"Failed to read CSV: {str(e)}")


def export_csv():
    file_path = filedialog.asksaveasfilename(
        defaultextension=".csv",
        filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
        initialfile="people_counter_log.csv"
    )
    if file_path:
        try:
            with open(csv_file_path, 'rb') as f_in, open(file_path, 'wb') as f_out:
                f_out.write(f_in.read())
            messagebox.showinfo("Success", f"CSV exported successfully to:\n{file_path}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export CSV: {str(e)}")


def email_csv_dialog():
    dialog = tk.Toplevel(window)
    dialog.title("Email CSV")
    dialog.geometry("400x300")
    dialog.resizable(False, False)

    tk.Label(dialog, text="Sender Email:", font=("Arial", 10)).pack(pady=(5, 0))
    sender_entry = tk.Entry(dialog, width=40, font=("Arial", 10))
    sender_entry.pack(pady=5)

    tk.Label(dialog, text="App Password:", font=("Arial", 10)).pack(pady=(5, 0))
    password_entry = tk.Entry(dialog, width=40, show="*", font=("Arial", 10))
    password_entry.pack(pady=5)

    tk.Label(dialog, text="Recipient Email:", font=("Arial", 10)).pack(pady=(5, 0))
    recipient_entry = tk.Entry(dialog, width=40, font=("Arial", 10))
    recipient_entry.pack(pady=5)

    def send_email():
        sender = sender_entry.get()
        password = password_entry.get()
        recipient = recipient_entry.get()

        if not all([sender, password, recipient]):
            messagebox.showerror("Error", "All fields are required")
            return

        try:
            msg = MIMEMultipart()
            msg['From'] = sender
            msg['To'] = recipient
            msg['Subject'] = "People Counter Log Data"

            body = "Please find attached the people counter log data."
            msg.attach(MIMEText(body, 'plain'))

            with open(csv_file_path, "rb") as f:
                attach = MIMEApplication(f.read(), _subtype="csv")
                attach.add_header('Content-Disposition', 'attachment', filename="people_counter_log.csv")
                msg.attach(attach)

            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(sender, password)
                server.send_message(msg)

            messagebox.showinfo("Success", "Email sent successfully!")
            dialog.destroy()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to send email:\n{str(e)}")

    btn_frame = tk.Frame(dialog)
    btn_frame.pack(pady=10)

    tk.Button(btn_frame, text="Cancel", command=dialog.destroy,
              bg="#F44336", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=10)

    tk.Button(btn_frame, text="Send Email", command=send_email,
              bg="#4CAF50", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=10)


# ================== MAIN LOOP ==================
def on_closing():
    stop_tracking()
    window.destroy()


window.protocol("WM_DELETE_WINDOW", on_closing)
window.mainloop()