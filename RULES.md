# Tech Stack

## 1. Tech Stack Overview
This project uses a specific hybrid stack.
- **Frontend Structure:** Standard HTML5 Tags (Avoid Blade Components like `<x-input>`).
- **Styling:** Vanilla CSS (Custom premium aesthetics) / Tailwind CSS (Utility).
- **Interactivity:** JavaScript (Fetch API, Lucide Icons).
- **Backend/Logic:** Supabase Edge Functions (Deno).
- **Database:** Supabase (PostgreSQL).
- **Hosting:** GitHub Pages / Vercel.

## 2. FIGMA DESIGN LINK
https://www.figma.com/design/ZZaNH5Kw3EhNFSNOb4hSbA/UMPSA-Pekan-Sport-Facility-Booking-System?node-id=12-1234&t=OuVYRdbgaZrSDMhv-1

## 3. DEPLOYMENT
https://github.com/mean1410/UMPSA-Sport-Facility-Booking-System/actions
( NEVER `git commit` and `git push` to github until explicitly told to do so because I need to review the code and run it locally first. )

## 4. DATABASE
https://supabase.com/dashboard/project/rggqjkyjldvjryzhyqjg

**Data Dictionary:**
Below is the reflected data dictionary from Supabase:

**User Table**
----------------------------------------------
Field               | Data Type    | Null | Key | Description
--------------------|--------------|------|-----|---------------------
user_id             | INT (Primary)| No   | PK  | Unique ID for the user
email               | VARCHAR(255) | No   |     | User email address
password            | VARCHAR(255) | No   |     | SHA-256 Hashed password
role                | VARCHAR(20)  | No   |     | User role (student/staff)
reset_token         | TEXT         | Yes  |     | Password reset UUID token
reset_token_expires | TIMESTAMPTZ  | Yes  |     | Expiry for reset token

**Admin Table**
----------------------------------------------
Field               | Data Type    | Null | Key | Description
--------------------|--------------|------|-----|---------------------
admin_id            | INT (Primary)| No   | PK  | Unique ID for the admin
email               | VARCHAR(255) | No   |     | Admin email address
password            | VARCHAR(255) | No   |     | SHA-256 Hashed password
role                | VARCHAR(20)  | No   |     | Administrative role
reset_token         | TEXT         | Yes  |     | Password reset UUID token
reset_token_expires | TIMESTAMPTZ  | Yes  |     | Expiry for reset token

**Facility Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
facility_id  | INT (Primary)| No   | PK  | Unique ID for the facility
admin_id     | INT          | No   | FK  | Links to Admin Table
name         | VARCHAR(100) | No   |     | Facility Name
type         | VARCHAR(50)  | No   |     | Category (Indoor / Outdoor)
status       | VARCHAR(20)  | No   |     | Available / In Maintenance
max_capacity | INT          | No   |     | Maximum capacity
location     | VARCHAR(255) | No   |     | Physical location
image_url    | TEXT         | Yes  |     | Path/URL to the facility image
created_at   | TIMESTAMPTZ  | Yes  |     | Auto-timestamp

**Booking Table**
----------------------------------------------
Field             | Data Type    | Null | Key | Description
------------------|--------------|------|-----|---------------------
booking_id        | INT (Primary)| No   | PK  | Unique Booking ID
user_id           | INT          | No   | FK  | Links to User Table
facility_id       | INT          | No   | FK  | Links to Facility Table
admin_id          | INT          | Yes  | FK  | Admin who handled booking
date              | DATE         | No   |     | Start date of the booking
end_date          | DATE         | Yes  |     | End date (for ranges)
time_slot         | VARCHAR(50)  | No   |     | e.g., '10:00 am - 12:00 pm'
purpose           | TEXT         | No   |     | Event purpose
num_of_participant| INT          | No   |     | Number of participants
status            | VARCHAR(20)  | No   |     | Confirmed / Pending / Cancelled
invoice_number    | TEXT         | Yes  |     | Unique Invoice Number
cancel_reason     | TEXT         | Yes  |     | Reason for cancellation
created_at        | TIMESTAMPTZ  | Yes  |     | Auto-timestamp

**Schedule Table**
----------------------------------------------
Field        | Data Type    | Null | Key | Description
-------------|--------------|------|-----|---------------------
schedule_id  | INT (Primary)| No   | PK  | Unique Schedule ID
facility_id  | INT          | No   | FK  | Links to Facility Table
day_of_week  | VARCHAR(15)  | No   |     | e.g., Monday, Tuesday
start_time   | TIME         | No   |     | Opening time
end_time     | TIME         | No   |     | Closing time
is_available | SMALLINT (1) | No   |     | Availability (1=Yes, 0=No)

**Report Table**
----------------------------------------------
Field           | Data Type    | Null | Key | Description
----------------|--------------|------|-----|---------------------
report_id       | INT (Primary)| No   | PK  | Unique Report ID
user_id         | INT          | No   | FK  | Links to User Table
facility_id     | INT          | No   | FK  | Links to Facility Table
admin_id        | INT          | Yes  | FK  | Admin assigned
issue_description| TEXT        | No   |     | Description of the issue
image_proof     | VARCHAR(255) | Yes  |     | Evidence image URL
status          | VARCHAR(20)  | No   |     | Pending / Resolved
created_at      | TIMESTAMPTZ  | Yes  |     | Auto-timestamp

**Facility_Closure Table**
----------------------------------------------
Field          | Data Type    | Null | Key | Description
---------------|--------------|------|-----|---------------------
closure_id     | INT (Primary)| No   | PK  | Unique Closure ID
facility_id    | INT          | No   | FK  | Links to Facility Table
admin_id       | INT          | Yes  | FK  | Admin who closed it
date           | DATE         | No   |     | Specific Date of closure
time_slot      | VARCHAR(50)  | Yes  |     | Specific time
reason         | TEXT         | Yes  |     | Reason for closure
created_at     | TIMESTAMPTZ  | Yes  |     | Auto-timestamp

**Announcement Table**
----------------------------------------------
Field          | Data Type    | Null | Key | Description
---------------|--------------|------|-----|---------------------
announcement_id| INT (Primary)| No   | PK  | Unique ID
admin_id       | INT          | No   | FK  | Links to Admin Table
title          | VARCHAR(255) | No   |     | Announcement Title
content        | TEXT         | No   |     | Main content
date_posted    | TIMESTAMP    | No   |     | Posted timestamp

---

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
