PRD: Cinema Booking System

Difficulty: Beginner–Intermediate
Project Type: Web App (React + Firebase)
Estimated Time: 4–6 hours

Overview

What:
A web application where users can view movies, check available cinema seats, and reserve a seat.

Who:
- Regular users who want to book cinema seats
- Admin users who manage movies and cinemas

Why:
To provide a simple and fast way to book cinema seats using a modern frontend (React) and backend-as-a-service (Firebase), without building a custom backend.

---

Core Features (MVP)

1. Google Authentication
- Users log in using Google via Firebase Authentication
- No manual registration/login system

Example:
User clicks “Login with Google” → Authenticated → Redirected to app

---

2. View Movies
- Display list of available movies from Firestore

Example:
- Avatar 2
- Oppenheimer
- Spider-Man

---

3. View Cinema Seats
- User selects a movie
- System displays seat layout (grid)
- Each seat shows status:
  - Available
  - Occupied

Example:
[A1][A2][A3]
[A4][X ][A6]

---

4. Book a Seat
- User clicks an available seat to reserve it
- Seat becomes occupied and unavailable to others
- Booking is stored in Firestore

Example:
User clicks A2 → A2 becomes occupied

---

5. Admin Panel (CRUD)

Admin can:
- Add movie/cinema
- Edit movie/cinema
- Delete movie/cinema

Example:
Add Movie → "Inception"
Delete Movie → "Avatar 2"

Admin is identified by predefined email(s)

---

Non-Goals

Will NOT build:
- Payment system
- Reservation expiration timers
- Notifications (email/SMS)
- Multi-location cinema system
- Advanced filtering/search

Will NOT use:
- Custom backend server
- External APIs
- Complex role/permission systems
- Third-party state management (Redux, etc.)

---

Technical Constraints

Frontend:
- React (functional components + hooks)

Authentication:
- Firebase Authentication (Google Sign-In)

Database:
- Firebase Firestore

State Management:
- useState / useContext only

Dependencies:
- Firebase SDK only

---

Data Model (Firestore)

users:
- id
- email
- role (user/admin)

movies:
- id
- title
- description (optional)

cinemas:
- id
- name
- movie_id

seats:
- id
- cinema_id
- seat_number (e.g. A1, A2)
- is_booked (boolean)

bookings:
- id
- user_id
- seat_id
- movie_id

---

Success Criteria

- User can log in using Google
- Movies are fetched and displayed from Firestore
- User can select a movie and see seat layout
- Available and occupied seats are clearly shown
- User can successfully book a seat
- Booked seat persists after page reload
- Seat cannot be double-booked
- Admin can add/edit/delete movies and cinemas
- UI updates correctly after all actions
- Invalid actions show clear error messages

---

Agent Rules

Always:
- Use Firebase Auth for authentication
- Store all data in Firestore
- Validate seat availability before booking
- Keep UI simple and functional
- Handle all inputs case-insensitively where applicable

Ask First:
- Before adding new features
- Before changing data structure

Never:
- Add payment system
- Use external APIs
- Add backend server
- Overcomplicate architecture or UI