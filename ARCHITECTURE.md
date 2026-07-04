# BhashaShikho — Architecture & Request Flow

This document visualizes how requests move through the system. Both diagrams below use [Mermaid](https://mermaid.js.org/) syntax, which GitHub renders automatically — no image upload needed.

---

## 1. System Architecture

High-level view of how the pieces are connected and hosted.

```mermaid
flowchart LR
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

    classDef client fill:#D3D1C7,stroke:#444441,stroke-width:2px,color:#000000
    classDef frontend fill:#AFA9EC,stroke:#26215C,stroke-width:2px,color:#000000
    classDef backend fill:#5DCAA5,stroke:#04342C,stroke-width:2px,color:#000000
    classDef database fill:#85B7EB,stroke:#042C53,stroke-width:2px,color:#000000
    classDef external fill:#F0997B,stroke:#4A1B0C,stroke-width:2px,color:#000000
    classDef monitor fill:#FAC775,stroke:#412402,stroke-width:2px,color:#000000

    class A client
    class B,C frontend
    class D,E,F backend
    class G database
    class H external
    class I monitor
```

---

## 2. Database Schema

Entity relationship diagram based on the `User` and `FriendRequest` Mongoose models.

```mermaid
erDiagram
    USER ||--o{ FRIENDREQUEST : sends
    USER ||--o{ FRIENDREQUEST : receives
    USER }o--o{ USER : "friends with"

    USER {
        ObjectId _id PK
        string fullName
        string email UK
        string password
        string bio
        string profilePic
        string nativeLanguage
        string learningLanguage
        string location
        boolean isOnboarded
        ObjectId_array friends FK
        date createdAt
        date updatedAt
    }

    FRIENDREQUEST {
        ObjectId _id PK
        ObjectId sender FK
        ObjectId recipient FK
        string status
        date createdAt
        date updatedAt
    }
```

**Notes:**
- `USER.friends` stores an array of `ObjectId` references back to other `USER` documents — this is what powers the many-to-many "friends with" relationship.
- `FRIENDREQUEST.status` is an enum: `"pending"` or `"accepted"`. There is no separate `"rejected"` state — a declined request is simply left as `"pending"` or removed.
- `FRIENDREQUEST.sender` and `.recipient` both reference `USER._id`, which is why the diagram shows two relationships (`sends` and `receives`) between the same two entities.
- `email` is unique (`UK`) and enforced at the schema level via Mongoose's `unique: true`.

---

## 3. Request Flow — Login

Step-by-step path of a single login request, from click to response.

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant M as 🗄️ MongoDB Atlas

    rect rgb(175, 169, 236)
    U->>F: Submits login form
    F->>B: POST /api/auth/login (email, password)
    end
    rect rgb(93, 202, 165)
    B->>M: User.findOne({ email })
    M-->>B: Returns user document
    B->>B: bcrypt.compare(password, hash)
    B->>B: jwt.sign({ userId })
    end
    rect rgb(175, 169, 236)
    B-->>F: 200 OK + Set-Cookie: jwt (httpOnly)
    F->>F: React Query invalidates "authUser"
    F->>B: GET /api/auth/me (cookie sent automatically)
    end
    rect rgb(93, 202, 165)
    B->>M: User.findById(decoded.userId)
    M-->>B: Returns user data
    end
    rect rgb(175, 169, 236)
    B-->>F: 200 OK + user object
    F-->>U: Redirects to Home page
    end
```

---

## 4. Request Flow — Sending a Friend Request

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant M as 🗄️ MongoDB Atlas

    rect rgb(175, 169, 236)
    U->>F: Clicks "Send Friend Request"
    F->>B: POST /api/users/friend-request/:id
    end
    rect rgb(93, 202, 165)
    B->>B: protectRoute middleware verifies JWT
    B->>M: Check if already friends / request exists
    M-->>B: No existing request found
    B->>M: FriendRequest.create({ sender, recipient })
    M-->>B: New request saved
    end
    rect rgb(175, 169, 236)
    B-->>F: 201 Created
    F->>F: Invalidate "outgoingFriendReqs" query
    F-->>U: Button shows "Request Sent"
    end
```

---

## 5. Request Flow — Starting a Video Call

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User (Browser)
    participant F as ⚛️ Frontend
    participant B as 🖥️ Backend
    participant S as 🎥 Stream API

    rect rgb(175, 169, 236)
    U->>F: Opens chat, clicks video call icon
    F->>B: GET /api/chat/token
    end
    rect rgb(93, 202, 165)
    B->>B: protectRoute middleware verifies JWT
    B->>S: generateStreamToken(userId)
    S-->>B: Returns Stream token
    end
    rect rgb(175, 169, 236)
    B-->>F: 200 OK + { token }
    end
    rect rgb(240, 153, 123)
    F->>S: StreamVideoClient.connect(user, token)
    S-->>F: Connection established
    F->>S: call.join({ create: true })
    S-->>F: Call room joined
    end
    F-->>U: Video call UI renders
```