# Personal Book Manager

A personal space to log books, track reading progress, and rediscover favorite authors — built with the MERN stack and Next.js.

**Live app:** https://book-manager-tawny.vercel.app/
**Repository:** https://github.com/Dhruv1175/book-manager

---

## Features

### Authentication
- Secure sign up and login with hashed passwords (bcrypt)
- JWT-based sessions stored in an httpOnly cookie
- Route protection via middleware, with server-side token verification on every protected API call
- Forgot-password flow: OTP sent via email, verified against a time-limited, single-use code, followed by a short-lived, single-use reset token before a password can be changed
- Preset avatar selection at sign up (no image uploads)

### Book Collection
- Add, edit, and delete books (title, author, tags, status)
- Filter by tag or reading status
- Status tracked as **Want to Read**, **Reading**, or **Completed**
- Book cover images fetched automatically from Open Library based on title and author, with a graceful fallback when no match is found

### Dashboard
- Total book count at a glance
- **Author Spotlight** — surfaces an author from your completed books, complete with an author photo where available
- Recently added books

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Node.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (`jose`), bcrypt for password hashing
- **Deployment:** Vercel + MongoDB Atlas

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- An email account for sending OTP emails (e.g. Gmail with an app password)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Dhruv1175/book-manager.git
   cd book-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the example environment file and fill in your own values
   ```bash
   cp .env.example .env
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

See `.env.example` for the full list. You'll need:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `EMAIL_SERVER_USER` | Email address used to send OTP emails |
| `EMAIL_SERVER_PASSWORD` | App password for the above email account |

If using MongoDB Atlas, make sure your IP (or `0.0.0.0/0` for development) is whitelisted under Network Access.

---

## Project Structure

```
book-manager/
├── app/
│   ├── api/
│   │   ├── auth/        # signup, login, logout, /me, OTP + reset-password flow
│   │   └── books/       # CRUD routes for the book collection
│   ├── auth/            # login, signup, reset-password pages
│   ├── dashboard/       # dashboard and book collection pages
├── components/          # AvatarSelector, DarkModeToggle, UserProfileDropDown
├── lib/
│   ├── auth.ts          # JWT signing/verification, password hashing
│   ├── coverLookUp.ts   # Open Library integration for book covers + author photos
│   ├── db.ts            # MongoDB connection (cached for serverless)
│   └── models/          # Mongoose schemas
├── middleware.ts         # Route protection
└── types/                # Shared TypeScript types
```

---

## Design Notes

- **Dual theme:** light mode uses a warm beige palette, dark mode uses a warm dark brown  with a lighter blue accent, keeping both themes tied to the same warm undertone rather than feeling like two unrelated palettes. Toggled from the nav and persisted across the session.
- **Restraint over noise:** the dashboard surfaces one meaningful number and one spotlight, rather than a row of stat cards.
- **Security by design:** passwords are never included in any API response; a dedicated public-facing user type keeps the password hash out of anything sent to the client.

---

## Known Limitations

- OTP requests aren't currently rate-limited per email address.
- OTP verification doesn't cap the number of failed attempts within the expiry window.

Both are reasonable next steps if this were extended beyond the assignment scope.

---

## Credits

- Book cover and author photo images are fetched via the [Open Library API](https://openlibrary.org/developers/api), a free, open service — no API key or attribution required, credited here regardless.
- Preset avatar icons sourced from [Flaticon](https://www.flaticon.com), also credited in-app per their attribution terms.

---

## Author

**Dhruv Bhanushali**
Built for the Thumbstack MERN Stack Developer assignment.