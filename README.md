<h1 align="center">✨ BhashaShikho ✨</h1>

<p align="center">
  A real-time language exchange platform where learners connect, chat, and video call with native speakers around the world.
</p>

<p align="center">
  🔗 <strong><a href="https://bhashashikho.vercel.app">Live Demo</a></strong> &nbsp;|&nbsp;
  ⚙️ <strong><a href="https://bhashashikho-backend.onrender.com">Backend API</a></strong>
</p>

> ℹ️ **Note:** The backend runs on Render's free tier and is kept awake via periodic uptime monitoring, so cold-start delays are minimized. In the rare case of a delay, the first request may take a few seconds longer while the server responds.

## Highlights

- 🌐 Real-time Messaging with Typing Indicators & Reactions
- 📹 1-on-1 Video Calls with Screen Sharing
- 🔐 JWT Authentication & Protected Routes
- 🌍 Language Exchange Platform with Multiple UI Themes
- 🧑‍🤝‍🧑 Friend Requests & Recommendations based on Language Preferences
- ⚡ Tech Stack: React + Express + MongoDB + TailwindCSS + TanStack Query
- 🚨 Centralized Error Handling (Frontend & Backend)
- 🎯 Real-time Chat & Video powered by Stream

## Tech Stack

**Frontend**
- React (Vite)
- TailwindCSS + DaisyUI
- TanStack Query (React Query)
- Zustand (global state management, e.g. theme)
- React Router
- Stream Chat & Video SDKs

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- Stream (Chat & Video API)

## Project Structure

```
BhashaShikho/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route logic (auth, chat, user)
│   │   ├── middleware/     # Auth middleware (JWT verification)
│   │   ├── models/         # Mongoose schemas (User, FriendRequest)
│   │   ├── routes/         # Express route definitions
│   │   ├── lib/            # DB connection, Stream client setup
│   │   └── server.js       # App entry point
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components (Navbar, Sidebar, etc.)
    │   ├── pages/           # Route-level pages (Home, Chat, Call, Profile, etc.)
    │   ├── hooks/            # Custom React Query hooks (useLogin, useAuthUser, etc.)
    │   ├── lib/               # Axios instance & API call functions
    │   ├── store/             # Zustand stores (theme)
    │   └── constants/         # Static data (languages, themes)
    └── .env
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)
- A free [Stream](https://getstream.io/) account for Chat & Video API keys

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/BhashaShikho.git
cd BhashaShikho
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following variables:

```env
PORT=5001
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
```

> ⚠️ Note: the variable names above intentionally read `STEAM_API_KEY` (not a typo in this README — matches what the codebase currently expects). If you rename them in code, keep the `.env` and `stream.js` in sync.

Run the backend:

```bash
npm run dev
```

The server will start on `http://localhost:5001`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` with:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Getting your Stream API keys

1. Sign up at [getstream.io](https://getstream.io/)
2. Create a new app in the Stream dashboard
3. Copy the **API Key** and **API Secret** into your backend `.env`
4. Copy the same **API Key** into your frontend `.env` (as `VITE_STREAM_API_KEY`)

## Deployment

This project is deployed using:

| Layer | Platform | URL |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | [bhashashikho.vercel.app](https://bhashashikho.vercel.app) |
| Backend | [Render](https://render.com) | [bhashashikho-backend.onrender.com](https://bhashashikho-backend.onrender.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) | — |
| Uptime Monitoring | [UptimeRobot](https://uptimerobot.com) | Pings the backend every 5 minutes to reduce cold-start delays |

**Environment variables** for both services are configured directly in the Render and Vercel dashboards (not committed to the repo — see `.env.example` files for the required keys).

## Features Overview

| Feature | Description |
|---|---|
| Sign Up / Login | Email & password auth with JWT stored in HTTP-only cookies |
| Onboarding | New users set up their profile (bio, native/learning language, location, avatar) |
| Profile | View and edit your profile anytime without redoing onboarding |
| Friend Recommendations | See other onboarded users matching your language-learning needs |
| Friend Requests | Send, receive, and accept friend requests |
| Real-time Chat | 1-on-1 messaging powered by Stream Chat |
| Video Calls | Start a video call directly from a chat, share a join link |
| Theming | Multiple color themes, persisted via Zustand |

## Available Scripts

**Backend** (`backend/package.json`)
```bash
npm run dev     # Start server with nodemon (auto-restart on changes)
```

**Frontend** (`frontend/package.json`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build (outputs to /dist)
npm run preview  # Preview the production build locally
```

## Future Enhancements

Planned improvements to make the platform more complete and production-ready:

- **Group Video Calls** — extend beyond 1-on-1 calls to support multiple participants in a single call room
- **Real-time Notifications** — currently notifications require a page refresh/refetch; add Socket.io or Stream's real-time events so friend requests and messages appear instantly
- **Message Search & Chat History Export** — allow users to search past conversations
- **Read Receipts & Online Status** — show when a message has been seen, and live online/offline indicators for friends
- **Push Notifications** — browser/mobile push notifications for new messages and friend requests
- **Language Proficiency Levels** — let users specify skill level (beginner/intermediate/fluent) for both native and learning languages, improving match quality
- **Advanced Matching Algorithm** — recommend users based on shared interests, timezone overlap, or mutual connections, not just language pairing
- **Block & Report Users** — safety features for a public-facing language exchange platform
- **Email Verification & Password Reset** — currently signup/login has no email confirmation or forgot-password flow
- **Rate Limiting & Input Sanitization** — harden API routes against abuse and injection attacks
- **Unit & Integration Tests** — add test coverage (Jest/Vitest + Supertest) for both frontend and backend
- **Mobile App** — React Native version for iOS/Android
- **Accessibility Improvements** — better screen-reader support (alt text, ARIA labels) across components
- **Admin Dashboard** — for moderating users, viewing platform analytics, and managing reported content

## License

This is a personal project. All rights reserved — not licensed for reuse or redistribution.