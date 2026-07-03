# BhashaShikho API Documentation

Base URL (development): `http://localhost:5001/api`

All authenticated endpoints require a valid JWT, sent automatically via an `httpOnly` cookie named `jwt`. This cookie is set on successful signup/login, so requests must be made with `credentials: include` (or `withCredentials: true` in Axios) to work correctly.

---

## Table of Contents

- [Auth Routes](#auth-routes)
  - [POST /auth/signup](#post-authsignup)
  - [POST /auth/login](#post-authlogin)
  - [POST /auth/logout](#post-authlogout)
  - [POST /auth/onboarding](#post-authonboarding)
  - [GET /auth/me](#get-authme)
- [User Routes](#user-routes)
  - [GET /users](#get-users)
  - [GET /users/friends](#get-usersfriends)
  - [POST /users/friend-request/:id](#post-usersfriend-requestid)
  - [PUT /users/friend-request/:id/accept](#put-usersfriend-requestidaccept)
  - [GET /users/friend-requests](#get-usersfriend-requests)
  - [GET /users/outgoing-friend-requests](#get-usersoutgoing-friend-requests)
- [Chat Routes](#chat-routes)
  - [GET /chat/token](#get-chattoken)
- [Error Format](#error-format)

---

## Auth Routes

### POST `/auth/signup`

Creates a new user account and logs them in (sets JWT cookie).

**Auth required:** No

**Request Body**
```json
{
  "fullName": "Aastha Bajpai",
  "email": "aastha@example.com",
  "password": "atleast6chars"
}
```

**Validation Rules**
- All fields are required
- `password` must be at least 6 characters
- `email` must be a valid email format
- `email` must not already exist in the database

**Success Response** — `201 Created`
```json
{
  "success": true,
  "user": {
    "_id": "665f1c2e...",
    "fullName": "Aastha Bajpai",
    "email": "aastha@example.com",
    "profilePic": "https://api.dicebear.com/7.x/avataaars/svg?seed=42",
    "isOnboarded": false,
    "friends": [],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 400 | Missing required fields |
| 400 | Password less than 6 characters |
| 400 | Invalid email format |
| 400 | Email already exists |
| 500 | Internal Server Error |

---

### POST `/auth/login`

Authenticates an existing user and sets the JWT cookie.

**Auth required:** No

**Request Body**
```json
{
  "email": "aastha@example.com",
  "password": "atleast6chars"
}
```

**Success Response** — `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "665f1c2e...",
    "fullName": "Aastha Bajpai",
    "email": "aastha@example.com",
    "profilePic": "...",
    "isOnboarded": true
  }
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 400 | Missing email or password |
| 401 | Invalid email or password |
| 500 | Internal Server Error |

---

### POST `/auth/logout`

Clears the JWT cookie, logging the user out.

**Auth required:** No

**Success Response** — `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### POST `/auth/onboarding`

Completes or updates the logged-in user's profile. Also used by the Profile page to edit an existing profile.

**Auth required:** Yes

**Request Body**
```json
{
  "fullName": "Aastha Bajpai",
  "bio": "Software engineer learning Spanish",
  "nativeLanguage": "hindi",
  "learningLanguage": "spanish",
  "location": "Delhi, India",
  "profilePic": "https://api.dicebear.com/7.x/avataaars/svg?seed=42"
}
```

**Validation Rules**
- `fullName`, `bio`, `nativeLanguage`, `learningLanguage`, `location` are all required

**Success Response** — `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "665f1c2e...",
    "fullName": "Aastha Bajpai",
    "isOnboarded": true,
    "...": "..."
  }
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 400 | Missing required fields (response includes `missingFields` array) |
| 401 | Not authenticated |
| 404 | User not found |
| 500 | Internal Server Error |

---

### GET `/auth/me`

Returns the currently logged-in user's data. Used on app load to check auth state.

**Auth required:** Yes

**Success Response** — `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "665f1c2e...",
    "fullName": "Aastha Bajpai",
    "email": "aastha@example.com",
    "isOnboarded": true,
    "...": "..."
  }
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 401 | No token provided / invalid token / user not found |
| 500 | Internal Server Error |

---

## User Routes

> All routes below require authentication (`protectRoute` middleware applied to the whole router).

### GET `/users`

Returns recommended users to connect with — excludes the current user, existing friends, and users who haven't completed onboarding.

**Success Response** — `200 OK`
```json
[
  {
    "_id": "665f...",
    "fullName": "John Doe",
    "profilePic": "...",
    "nativeLanguage": "english",
    "learningLanguage": "hindi",
    "location": "New York, USA",
    "bio": "..."
  }
]
```

---

### GET `/users/friends`

Returns the current user's friends list (populated with basic profile info).

**Success Response** — `200 OK`
```json
[
  {
    "_id": "665f...",
    "fullName": "Jane Doe",
    "profilePic": "...",
    "nativeLanguage": "spanish",
    "learningLanguage": "hindi"
  }
]
```

---

### POST `/users/friend-request/:id`

Sends a friend request to the user with the given `id`.

**URL Params**
| Param | Description |
|---|---|
| `id` | MongoDB `_id` of the recipient user |

**Success Response** — `201 Created`
```json
{
  "_id": "...",
  "sender": "665f...",
  "recipient": "665e...",
  "status": "pending"
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 400 | Sending a request to yourself |
| 400 | Already friends |
| 400 | Request already exists between the two users |
| 404 | Recipient not found |
| 500 | Internal Server Error |

---

### PUT `/users/friend-request/:id/accept`

Accepts a pending friend request. Adds both users to each other's friends list.

**URL Params**
| Param | Description |
|---|---|
| `id` | MongoDB `_id` of the FriendRequest document |

**Success Response** — `200 OK`
```json
{
  "message": "Friend request accepted"
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 403 | You are not the recipient of this request |
| 404 | Friend request not found |
| 500 | Internal Server Error |

---

### GET `/users/friend-requests`

Returns incoming (pending) and recently accepted friend requests for the current user.

**Success Response** — `200 OK`
```json
{
  "incomingReqs": [
    {
      "_id": "...",
      "sender": {
        "fullName": "John Doe",
        "profilePic": "...",
        "nativeLanguage": "english",
        "learningLanguage": "hindi"
      },
      "status": "pending"
    }
  ],
  "acceptedReqs": [
    {
      "_id": "...",
      "recipient": { "fullName": "Jane Doe", "profilePic": "..." },
      "status": "accepted"
    }
  ]
}
```

---

### GET `/users/outgoing-friend-requests`

Returns friend requests the current user has sent that are still pending.

**Success Response** — `200 OK`
```json
[
  {
    "_id": "...",
    "recipient": {
      "fullName": "John Doe",
      "profilePic": "...",
      "nativeLanguage": "english",
      "learningLanguage": "hindi"
    },
    "status": "pending"
  }
]
```

---

## Chat Routes

### GET `/chat/token`

**Auth required:** Yes

Generates a Stream Chat/Video token for the currently logged-in user, used by the frontend to authenticate with Stream's SDKs (for both chat and video calls).

**Success Response** — `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Responses**
| Status | Reason |
|---|---|
| 500 | Internal Server Error (e.g. Stream credentials misconfigured) |

---

## Error Format

All error responses follow this shape:

```json
{
  "message": "Human-readable error description"
}
```

Some validation errors (e.g. onboarding) additionally include a `missingFields` array listing which fields were left empty.

## Authentication Notes

- JWT is issued on signup/login and stored as an `httpOnly` cookie named `jwt` (not accessible via JavaScript, for security).
- Cookie expires after **7 days**.
- Protected routes use the `protectRoute` middleware, which verifies the JWT, loads the user from MongoDB, and attaches it to `req.user`.
- The frontend must send requests with credentials enabled (`axios.create({ withCredentials: true })`) for the cookie to be included automatically.