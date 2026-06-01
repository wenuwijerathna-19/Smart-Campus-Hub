# Smart Campus Hub Requirements

## Overview
This system is an integrated campus management solution covering resource booking, facility maintenance tracking, real-time notifications, and user authentication.

## 1. Functional Requirements

### Module A - Facilities & Assets (Resource Management)
- **Add Resources**: The system shall allow administrators to add academic resources such as Rooms, Labs, and Equipment.
- **Resource Details**: Each resource shall capture: Name, Type (ROOM, LAB, EQUIPMENT), Capacity, Location, and Status (ACTIVE, OUT_OF_SERVICE).
- **Search & Filter**: Users shall be able to search for specific assets and filter out resources by type and status in real-time.

### Module B - Booking System
- **Resource Requesting**: Users shall be able to request a resource by specifying Date, Time (Start/End), and Purpose.
- **Booking Workflow**: 
  - Each booking starts as `PENDING`.
  - Admins can update the status to `APPROVED` or `REJECTED`.
  - Approved or pending bookings can be `CANCELLED` by the requester.
- **Clash Prevention**: The system must prevent concurrent bookings for the exact same resource within identical or overlapping time slots.

### Module C - Maintenance Tickets
- **Issue Reporting**: Users shall be able to create maintenance tickets for resources with detailed descriptions.
- **Multiple Image Uploads**: The system shall allow users to upload up to 3 evidence images when reporting an issue.
- **Ticket Workflow**: Tickets shall natively cycle through statuses: `OPEN` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`.
- **Assignment & Collaboration**: Technicians can be assigned to open tickets, and both staff and users can post comments tracking the resolution effort.

### Module D - Notifications
- **Real-time Event Triggers**: The system shall generate notifications for critical events, such as changes to a Booking status or Ticket updates.
- **Notification Panel**: An interface shall highlight unread updates using a dynamic visual counter.

### Module E - Security
- **OAuth Login**: The system handles users natively via JWT, augmenting their initial login safely with Google OAuth authentication standards.
- **Role-Based Profiles**: The system distinguishes access for `USER`, `ADMIN`, and `TECHNICIAN`.

## 2. Non-Functional Requirements
- **Performance**: The application must execute API filtering queries in under 500ms to preserve the dashboard's snappy feel.
- **Security**: The backend must ensure endpoints are protected securely behind stateless JWT authorization. Passwords must be hashed using BCrypt.
- **Scalability**: The MongoDB collections must properly link foreign relations (`@DBRef`) while efficiently handling queries for hundreds of parallel resources.
