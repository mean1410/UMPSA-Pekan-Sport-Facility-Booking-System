# Tech Stack

## 1. Tech Stack Overview
This project uses a specific hybrid stack.
- **Frontend Structure:** Standard HTML5 Tags (Avoid Blade Components like `<x-input>`).
- **Styling:** Tailwind CSS.
- **Interactivity:** Livewire (Used on standard HTML elements).
- **Backend/Logic:** JavaScript.
- **Database:** Supabase ( Connected Through MCP ).
- **Hosting:** GitHub ( Connected Through MCP ).

## 2. FIGMA DESIGN LINK
https://www.figma.com/design/ZZaNH5Kw3EhNFSNOb4hSbA/UMPSA-Pekan-Sport-Facility-Booking-System?node-id=12-1234&t=OuVYRdbgaZrSDMhv-1
( Connected Through MCP )

## 3. DEPLOYMENT
https://github.com/mean1410/UMPSA-Sport-Facility-Booking-System/actions
( NEVER `git commit` and `git push` to github until explicitly told to do so because I need to review the code and run it locally first. )

## 4. DATABASE
https://supabase.com/dashboard/project/rggqjkyjldvjryzhyqjg
( Connected Through MCP )

**Data Dictionary:**
    Below is the data dictionary for the database:

**User Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
user_id      | INT(11)      | No   | PK  | Unique ID for the user
email        | VARCHAR(255) | No   |     | User email address
password     | VARCHAR(255) | No   |     | Encrypted password
role         | VARCHAR(20)  | No   |     | User role

**Admin Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
admin_id     | INT(11)      | No   | PK  | Unique ID for the admin
email        | VARCHAR(255) | No   |     | Admin email address
password     | VARCHAR(255) | No   |     | Encrypted password
role         | VARCHAR(20)  | No   |     | Administrative role

**Facility Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
facility_id  | INT(11)      | No   | PK  | Unique ID for the facility
admin_id     | INT(11)      | No   | FK  | Links to Admin Table
name         | VARCHAR(100) | No   |     | Facility Name
type         | VARCHAR(50)  | No   |     | Category of facility (Indoor / Outdoor)
status       | VARCHAR(20)  | No   |     | Available / In Maintenance
max_capacity | INT(11)      | No   |     | Maximum capacity of the facility
location     | VARCHAR(255) | No   |     | Physical location/address of the facility
image_url    | TEXT         | Yes  |     | Path/URL to the facility image
created_at   | TIMESTAMPTZ  | Yes  |     | Auto-timestamp of creation

**Booking Table**
----------------------------------------------
Field             | Data Type    | Null | Key | Description
------------------|--------------|------|-----|---------------------
booking_id        | INT(11)      | No   | PK  | Unique Booking ID
user_id           | INT(11)      | No   | FK  | Links to User Table
facility_id       | INT(11)      | No   | FK  | Links to Facility Table
admin_id          | INT(11)      | Yes  | FK  | Links to Admin Table (if managed by admin)
date              | DATE         | No   |     | Start date of the booking
end_date          | DATE         | Yes  |     | End date of the booking (for multi-day range)
time_slot         | VARCHAR(50)  | No   |     | Selected time range (e.g., '10:00 am - 12:00 pm')
purpose           | TEXT         | No   |     | Event purpose
num_of_participant| INT(11)      | No   |     | Number of participants
status            | VARCHAR(20)  | No   |     | Confirmed, Pending, or Cancelled
invoice_number    | TEXT         | Yes  |     | Unique Invoice Number
created_at        | TIMESTAMPTZ  | Yes  |     | Auto-timestamp of creation

**Schedule Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
schedule_id  | INT(11)      | No   | PK  | Unique Schedule ID
facility_id  | INT(11)      | No   | FK  | Links to Facility Table
day_of_week  | VARCHAR(15)  | No   |     | Day (e.g., Monday, Tuesday)
start_time   | TIME         | No   |     | Opening/Start time
end_time     | TIME         | No   |     | Closing/End time
is_available | TINYINT(1)   | No   |     | Availability flag (1=Yes, 0=No)

**Report Table**
----------------------------------------------
Field           | Data Type    | Null | Key | Description
----------------|--------------|------|-----|---------------------
report_id       | INT(11)      | No   | PK  | Unique Report ID
user_id         | INT(11)      | No   | FK  | Links to User Table
facility_id     | INT(11)      | No   | FK  | Links to Facility Table
admin_id        | INT(11)      | Yes  | FK  | Links to Admin Table
issue_description| TEXT        | No   |     | Description of the damage/issue
image_proof     | VARCHAR(255) | Yes  |     | Path/URL to image evidence
status          | VARCHAR(20)  | No   |     | Status (Pending/Resolved)

**Facility_Closure Table**
----------------------------------------------
Field          | Data Type    | Null | Key | Description
---------------|--------------|------|-----|---------------------
closure_id     | INT(11)      | No   | PK  | Unique Closure ID
facility_id    | INT(11)      | No   | FK  | Links to Facility Table
admin_id       | INT(11)      | Yes  | FK  | Admin who closed it
date           | DATE         | No   |     | Specific Date of closure
time_slot      | VARCHAR(50)  | Yes  |     | Specific time
reason         | TEXT         | Yes  |     | Reason for closure
created_at     | TIMESTAMPTZ  | Yes  |     | Auto-timestamp of creation

**Announcement Table**
----------------------------------------------
Field          | Data Type    | Null | Key | Description
---------------|--------------|------|-----|---------------------
announcement_id| INT(11)      | No   | PK  | Unique Announcement ID
admin_id       | INT(11)      | No   | FK  | Links to Admin Table
title          | VARCHAR(255) | No   |     | Announcement Title
content        | TEXT         | No   |     | Main content of the announcement
date_posted    | DATETIME     | No   |     | Date and time posted

if you update supabase pls update this table too but ensure data type stay same style

## 5. IMPORTANT
- Starting from dashboard we only reuse header only because footer stopped at auth pages. All hover animations must be same like landing page. For view make sure you maintain the 80% chrome zoom for the whole project. The profile icon if user/admin click it will show the profile dropdown menu showing logout button only.

## 6. PROJECT ARCHITECTURE (APP SHELL)
To maintain consistency and ease of development, this project uses an **App Shell Architecture** for the User and Admin Dashboards.
- **Single Page Entry:** Instead of multiple separate HTML files for every feature (Search, Report, etc.), we use a main "Shell" (e.g., `UserDashboard.html`).
- **Dynamic Content Swapping:** JavaScript is used to swap the content inside the `<main>` container based on sidebar navigation.
- **Benefits:** 
    - **Performance:** No "white flash" or slow page reloads.
    - **Maintenance:** Changes to the Header or Sidebar only need to be made in **one** file.
    - **Cleanliness:** Avoids duplicate folders and files for every sub-page.
- **Workflow:** Sub-features (Search, Reports, Announcements) are built as hidden `<div>` sections or template strings and toggled by the main Shell.



## 7. SCHEDULE & AVAILABILITY LOGIC
The 'Weekly Availability' grid status is determined by checking three layers in order:

1. **Weekly Schedule (Fixed Hours)**:
   - Defined in the 'Schedule' table (e.g., 10:00 AM - 06:00 PM).
   - If a slot choice (e.g., 9:00 AM) is outside these hours or the day is set to is_available = 0, it is 'Close' (Dark Red).

2. **Facility Closures (Ad-hoc)**:
   - Defined in the 'Facility_Closure' table for specific dates/times (e.g., Maintenance on Jan 3rd).
   - If a matching record exists, the slot is 'Close' (Dark Red).

3. **Confirmed Bookings**:
   - Defined in the 'Booking' table.
   - If a 'Confirmed' booking exists for that date/time, the slot is 'Booked' (Teal).

4. **Available**:
   - If a slot is within scheduled hours, NOT closed by admin, and NOT booked, it is 'Available' (Light Gray).
