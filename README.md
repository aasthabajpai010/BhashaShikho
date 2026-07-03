<h1 align="center">✨ BhashaShikho ✨</h1>

<p align="center">
  A real-time language exchange platform where learners connect, chat, and video call with native speakers around the world.
</p>

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

## API Documentation

Full API reference available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

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

## License

This project is open source and available for learning purposes.

