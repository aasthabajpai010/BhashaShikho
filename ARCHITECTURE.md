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

    classDef client fill:#F1EFE8,stroke:#888780,stroke-width:1px,color:#2C2C2A
    classDef frontend fill:#EEEDFE,stroke:#7F77DD,stroke-width:1px,color:#26215C
    classDef backend fill:#E1F5EE,stroke:#1D9E75,stroke-width:1px,color:#04342C
    classDef database fill:#E6F1FB,stroke:#378ADD,stroke-width:1px,color:#042C53
    classDef external fill:#FAECE7,stroke:#D85A30,stroke-width:1px,color:#4A1B0C
    classDef monitor fill:#FAEEDA,stroke:#BA7517,stroke-width:1px,color:#412402

    class A client
    class B,C frontend
    class D,E,F backend
    class G database
    class H external
    class I monitor
```

---

## 2. Request Flow — Login

Step-by-step path of a single login request, from click to response.

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant M as 🗄️ MongoDB Atlas

    rect rgb(238, 237, 254)
    U->>F: Submits login form
    F->>B: POST /api/auth/login (email, password)
    end
    rect rgb(225, 245, 238)
    B->>M: User.findOne({ email })
    M-->>B: Returns user document
    B->>B: bcrypt.compare(password, hash)
    B->>B: jwt.sign({ userId })
    end
    rect rgb(238, 237, 254)
    B-->>F: 200 OK + Set-Cookie: jwt (httpOnly)
    F->>F: React Query invalidates "authUser"
    F->>B: GET /api/auth/me (cookie sent automatically)
    end
    rect rgb(225, 245, 238)
    B->>M: User.findById(decoded.userId)
    M-->>B: Returns user data
    end
    rect rgb(238, 237, 254)
    B-->>F: 200 OK + user object
    F-->>U: Redirects to Home page
    end
```

---

## 3. Request Flow — Sending a Friend Request

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant M as 🗄️ MongoDB Atlas

    rect rgb(238, 237, 254)
    U->>F: Clicks "Send Friend Request"
    F->>B: POST /api/users/friend-request/:id
    end
    rect rgb(225, 245, 238)
    B->>B: protectRoute middleware verifies JWT
    B->>M: Check if already friends / request exists
    M-->>B: No existing request found
    B->>M: FriendRequest.create({ sender, recipient })
    M-->>B: New request saved
    end
    rect rgb(238, 237, 254)
    B-->>F: 201 Created
    F->>F: Invalidate "outgoingFriendReqs" query
    F-->>U: Button shows "Request Sent"
    end
```

---

## 4. Request Flow — Starting a Video Call

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant S as 🎥 Stream API

    rect rgb(238, 237, 254)
    U->>F: Opens chat, clicks video call icon
    F->>B: GET /api/chat/token
    end
    rect rgb(225, 245, 238)
    B->>B: protectRoute middleware verifies JWT
    B->>S: generateStreamToken(userId)
    S-->>B: Returns Stream token
    end
    rect rgb(238, 237, 254)
    B-->>F: 200 OK + { token }
    end
    rect rgb(250, 236, 231)
    F->>S: StreamVideoClient.connect(user, token)
    S-->>F: Connection established
    F->>S: call.join({ create: true })
    S-->>F: Call room joined
    end
    F-->>U: Video call UI renders
```