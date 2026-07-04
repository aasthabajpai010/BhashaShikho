# BhashaShikho — Architecture & Request Flow

This document visualizes how requests move through the system. Both diagrams below use [Mermaid](https://mermaid.js.org/) syntax, which GitHub renders automatically — no image upload needed.

---

## 1. System Architecture

High-level view of how the pieces are connected and hosted.

```mermaid
flowchart TB
    subgraph Client
        A[Browser]
    end

    subgraph Frontend["Frontend — Vercel"]
        B[React + Vite App]
        C[Stream Chat/Video SDK]
    end

    subgraph Backend["Backend — Render"]
        D[Express Server]
        E[Auth Middleware<br/>JWT via httpOnly cookie]
        F[Controllers<br/>auth, user, chat]
    end

    subgraph External["External Services"]
        G[(MongoDB Atlas<br/>Users, Friend Requests)]
        H[Stream API<br/>Chat + Video]
    end

    A -->|HTTPS| B
    B -->|REST API calls| D
    B -.->|Realtime chat/video| H
    D --> E
    E --> F
    F -->|Mongoose queries| G
    F -->|Generate tokens| H

    I[UptimeRobot] -.->|Pings every 5 min| D
```

---

## 2. Request Flow — Login

Step-by-step path of a single login request, from click to response.

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant M as MongoDB Atlas

    U->>F: Submits login form
    F->>B: POST /api/auth/login (email, password)
    B->>M: User.findOne({ email })
    M-->>B: Returns user document
    B->>B: bcrypt.compare(password, hash)
    B->>B: jwt.sign({ userId })
    B-->>F: 200 OK + Set-Cookie: jwt (httpOnly)
    F->>F: React Query invalidates "authUser"
    F->>B: GET /api/auth/me (cookie sent automatically)
    B->>M: User.findById(decoded.userId)
    M-->>B: Returns user data
    B-->>F: 200 OK + user object
    F-->>U: Redirects to Home page
```

---

## 3. Request Flow — Sending a Friend Request

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant M as MongoDB Atlas

    U->>F: Clicks "Send Friend Request"
    F->>B: POST /api/users/friend-request/:id
    B->>B: protectRoute middleware verifies JWT
    B->>M: Check if already friends / request exists
    M-->>B: No existing request found
    B->>M: FriendRequest.create({ sender, recipient })
    M-->>B: New request saved
    B-->>F: 201 Created
    F->>F: Invalidate "outgoingFriendReqs" query
    F-->>U: Button shows "Request Sent"
```

---

## 4. Request Flow — Starting a Video Call

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant S as Stream API

    U->>F: Opens chat, clicks video call icon
    F->>B: GET /api/chat/token
    B->>B: protectRoute middleware verifies JWT
    B->>S: generateStreamToken(userId)
    S-->>B: Returns Stream token
    B-->>F: 200 OK + { token }
    F->>S: StreamVideoClient.connect(user, token)
    S-->>F: Connection established
    F->>S: call.join({ create: true })
    S-->>F: Call room joined
    F-->>U: Video call UI renders
```

---

## How to use this file

Paste this file (or individual diagram blocks) directly into your `README.md`, or keep it as a standalone `ARCHITECTURE.md` linked from the README. GitHub renders Mermaid code blocks automatically — no plugins or image exports required.