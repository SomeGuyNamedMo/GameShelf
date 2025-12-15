# GameShelf API Contract

This document defines the API contract between the frontend (client/) and backend (server/).
Both modules must implement according to this specification.

---

## Base Configuration

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **Auth**: Bearer token in `Authorization` header

---

## Authentication

### POST /api/auth/register
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "cuid_xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": null,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `400` - Validation error (email taken, weak password)

---

### POST /api/auth/login
Authenticate and receive JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "cuid_xxx",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": null,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**Errors:**
- `401` - Invalid credentials

---

### GET /api/auth/me
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "cuid_xxx",
  "email": "user@example.com",
  "name": "John Doe",
  "avatarUrl": null,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## Libraries

### GET /api/libraries
Get all libraries the user belongs to.

**Response (200):**
```json
{
  "libraries": [
    {
      "id": "lib_xxx",
      "name": "Home Collection",
      "description": "Our family board games",
      "role": "ADMIN",
      "gameCount": 47,
      "memberCount": 4,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST /api/libraries
Create a new library (user becomes ADMIN).

**Request:**
```json
{
  "name": "Home Collection",
  "description": "Our family board games"
}
```

**Response (201):**
```json
{
  "id": "lib_xxx",
  "name": "Home Collection",
  "description": "Our family board games",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

### GET /api/libraries/:libraryId
Get library details with members.

**Response (200):**
```json
{
  "id": "lib_xxx",
  "name": "Home Collection",
  "description": "Our family board games",
  "createdAt": "2024-01-15T10:00:00Z",
  "members": [
    {
      "userId": "user_xxx",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "joinedAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST /api/libraries/:libraryId/members
Invite a user to the library. **Requires ADMIN role.**

**Request:**
```json
{
  "email": "friend@example.com",
  "role": "MEMBER"
}
```

**Response (201):**
```json
{
  "userId": "user_yyy",
  "name": "Jane Doe",
  "email": "friend@example.com",
  "role": "MEMBER",
  "joinedAt": "2024-01-15T10:00:00Z"
}
```

---

### PATCH /api/libraries/:libraryId/members/:userId
Update a member's role. **Requires ADMIN role.**

**Request:**
```json
{
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "userId": "user_yyy",
  "role": "ADMIN"
}
```

---

### DELETE /api/libraries/:libraryId/members/:userId
Remove a member. **Requires ADMIN role.**

**Response (204):** No content

---

## Games

### GET /api/libraries/:libraryId/games
List games with optional filtering.

**Query Parameters:**
- `q` (string) - Natural language search: "2 player under 30 min"
- `status` (enum) - AVAILABLE, BORROWED, STORAGE
- `location` (string) - Filter by location
- `minPlayers` (int) - Minimum player count
- `maxPlayers` (int) - Maximum player count
- `maxPlaytime` (int) - Maximum playtime in minutes
- `category` (string) - Category filter
- `sort` (string) - title, rating, lastPlayed, playtime
- `order` (string) - asc, desc

**Response (200):**
```json
{
  "games": [
    {
      "id": "game_xxx",
      "bggId": 266192,
      "title": "Wingspan",
      "coverUrl": "https://...",
      "minPlayers": 1,
      "maxPlayers": 5,
      "playtimeMin": 40,
      "playtimeMax": 70,
      "description": "A competitive bird-collection game...",
      "categories": ["Strategy", "Animals", "Card Game"],
      "mechanics": ["Engine Building", "Card Drafting"],
      "location": "Main Shelf A",
      "status": "AVAILABLE",
      "rating": 4.5,
      "timesPlayed": 12,
      "lastPlayedAt": "2024-01-10T18:00:00Z",
      "expansionCount": 3
    }
  ],
  "total": 47
}
```

---

### POST /api/libraries/:libraryId/games
Add a game. **Requires MEMBER or ADMIN role.**

**Request:**
```json
{
  "bggId": 266192,
  "title": "Wingspan",
  "coverUrl": "https://...",
  "minPlayers": 1,
  "maxPlayers": 5,
  "playtimeMin": 40,
  "playtimeMax": 70,
  "description": "A competitive bird-collection game...",
  "categories": ["Strategy", "Animals", "Card Game"],
  "mechanics": ["Engine Building", "Card Drafting"],
  "location": "Main Shelf A"
}
```

**Response (201):**
```json
{
  "id": "game_xxx",
  "title": "Wingspan",
  ...
}
```

---

### GET /api/libraries/:libraryId/games/:gameId
Get full game details with expansions.

**Response (200):**
```json
{
  "id": "game_xxx",
  "bggId": 266192,
  "title": "Wingspan",
  "coverUrl": "https://...",
  "minPlayers": 1,
  "maxPlayers": 5,
  "playtimeMin": 40,
  "playtimeMax": 70,
  "description": "A competitive bird-collection game...",
  "categories": ["Strategy", "Animals", "Card Game"],
  "mechanics": ["Engine Building", "Card Drafting"],
  "location": "Main Shelf A",
  "status": "AVAILABLE",
  "rating": 4.5,
  "timesPlayed": 12,
  "lastPlayedAt": "2024-01-10T18:00:00Z",
  "createdAt": "2024-01-01T10:00:00Z",
  "expansions": [
    {
      "id": "exp_xxx",
      "name": "European Expansion",
      "owned": true
    }
  ],
  "borrowHistory": [
    {
      "id": "borrow_xxx",
      "borrower": {
        "id": "user_xxx",
        "name": "Sarah Chen"
      },
      "borrowedAt": "2024-01-05T10:00:00Z",
      "returnedAt": "2024-01-08T10:00:00Z"
    }
  ]
}
```

---

### PATCH /api/libraries/:libraryId/games/:gameId
Update a game. **Requires MEMBER or ADMIN role.**

**Request:** (partial update)
```json
{
  "location": "Living Room Cabinet",
  "rating": 5
}
```

**Response (200):** Full game object

---

### DELETE /api/libraries/:libraryId/games/:gameId
Delete a game. **Requires ADMIN role.**

**Response (204):** No content

---

## Borrowing

### POST /api/borrow/games/:gameId/checkout
Borrow a game. Sets status to BORROWED.

**Request:**
```json
{
  "dueAt": "2024-01-20T10:00:00Z"
}
```

**Response (200):**
```json
{
  "id": "borrow_xxx",
  "gameId": "game_xxx",
  "gameTitle": "Wingspan",
  "borrowedAt": "2024-01-15T10:00:00Z",
  "dueAt": "2024-01-20T10:00:00Z"
}
```

---

### POST /api/borrow/games/:gameId/return
Return a game. Sets status to AVAILABLE.

**Response (200):**
```json
{
  "id": "borrow_xxx",
  "gameId": "game_xxx",
  "returnedAt": "2024-01-18T10:00:00Z"
}
```

---

### GET /api/borrow/active
Get current user's active borrows.

**Response (200):**
```json
{
  "borrows": [
    {
      "id": "borrow_xxx",
      "game": {
        "id": "game_xxx",
        "title": "Wingspan",
        "coverUrl": "https://..."
      },
      "library": {
        "id": "lib_xxx",
        "name": "Home Collection"
      },
      "borrowedAt": "2024-01-15T10:00:00Z",
      "dueAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### GET /api/libraries/:libraryId/borrows
Get all active borrows for a library. **Requires MEMBER role.**

**Response (200):**
```json
{
  "borrows": [
    {
      "id": "borrow_xxx",
      "game": {
        "id": "game_xxx",
        "title": "Wingspan"
      },
      "borrower": {
        "id": "user_xxx",
        "name": "Sarah Chen",
        "email": "sarah@example.com"
      },
      "borrowedAt": "2024-01-15T10:00:00Z",
      "dueAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## BoardGameGeek Integration

### GET /api/bgg/search
Search BoardGameGeek for games.

**Query Parameters:**
- `q` (string, required) - Search query

**Response (200):**
```json
{
  "results": [
    {
      "bggId": 266192,
      "title": "Wingspan",
      "yearPublished": 2019,
      "thumbnailUrl": "https://..."
    }
  ]
}
```

---

### GET /api/bgg/game/:bggId
Get full game details from BGG.

**Response (200):**
```json
{
  "bggId": 266192,
  "title": "Wingspan",
  "description": "A competitive bird-collection...",
  "yearPublished": 2019,
  "coverUrl": "https://...",
  "minPlayers": 1,
  "maxPlayers": 5,
  "playtimeMin": 40,
  "playtimeMax": 70,
  "categories": ["Animals", "Card Game"],
  "mechanics": ["Dice Rolling", "Engine Building", "Hand Management"],
  "bggRating": 8.1
}
```

---

## Playlists

### GET /api/libraries/:libraryId/playlists
Get all playlists for a library.

**Response (200):**
```json
{
  "playlists": [
    {
      "id": "pl_xxx",
      "name": "Date Night",
      "icon": "❤️",
      "isSmartList": false,
      "gameCount": 5
    },
    {
      "id": "pl_yyy",
      "name": "Quick Plays",
      "icon": "⚡",
      "isSmartList": true,
      "smartCriteria": { "maxPlaytime": 30 },
      "gameCount": 12
    }
  ]
}
```

---

### POST /api/libraries/:libraryId/playlists
Create a playlist. **Requires MEMBER role.**

**Request:**
```json
{
  "name": "Party Games",
  "icon": "🎉",
  "isSmartList": false
}
```

Or for smart playlist:
```json
{
  "name": "Quick Plays",
  "icon": "⚡",
  "isSmartList": true,
  "smartCriteria": {
    "maxPlaytime": 30,
    "status": "AVAILABLE"
  }
}
```

---

### GET /api/playlists/:playlistId
Get playlist with games.

**Response (200):**
```json
{
  "id": "pl_xxx",
  "name": "Date Night",
  "icon": "❤️",
  "isSmartList": false,
  "games": [
    {
      "id": "game_xxx",
      "title": "7 Wonders Duel",
      "coverUrl": "https://...",
      "order": 0
    }
  ]
}
```

---

### POST /api/playlists/:playlistId/games
Add game to playlist (non-smart only).

**Request:**
```json
{
  "gameId": "game_xxx"
}
```

---

### DELETE /api/playlists/:playlistId/games/:gameId
Remove game from playlist.

---

## Game Import

GameShelf supports 3 methods for adding games to a library.

### GET /api/import/search
Search for games by name (autocomplete).

**Query Parameters:**
- `q` (string, required) - Search query (min 2 characters)

**Response (200):**
```json
{
  "results": [
    {
      "bggId": 266192,
      "title": "Wingspan",
      "yearPublished": 2019
    }
  ]
}
```

---

### POST /api/import/preview
Preview bulk import - parse game list and match against database.

**Request:**
```json
{
  "content": "Wingspan\nCatan\nGloomhaven\nSome Unknown Game"
}
```

Supported formats:
- Plain text (one game per line)
- Numbered lists ("1. Wingspan", "2) Catan")
- CSV (first column is game name)

**Response (200):**
```json
{
  "total": 4,
  "matched": 3,
  "unmatched": 1,
  "games": [
    {
      "input": "Wingspan",
      "matched": true,
      "confidence": 1.0,
      "game": {
        "bggId": 266192,
        "title": "Wingspan",
        "yearPublished": 2019
      },
      "suggestions": []
    },
    {
      "input": "Some Unknown Game",
      "matched": false,
      "confidence": 0.3,
      "suggestions": [
        { "bggId": 123, "title": "Some Game", "yearPublished": 2020 }
      ]
    }
  ]
}
```

---

### POST /api/libraries/:libraryId/import/bulk
Confirm and import games from bulk preview. **Requires MEMBER role.**

**Request:**
```json
{
  "games": [
    {
      "bggId": 266192,
      "title": "Wingspan",
      "coverUrl": "https://...",
      "minPlayers": 1,
      "maxPlayers": 5,
      "playtimeMin": 40,
      "playtimeMax": 70,
      "description": "A bird-collection game...",
      "categories": ["Strategy", "Card Game"],
      "mechanics": ["Engine Building"]
    }
  ]
}
```

**Response (201):**
```json
{
  "imported": 3,
  "games": [
    { "id": "game_xxx", "title": "Wingspan", ... }
  ]
}
```

---

### POST /api/libraries/:libraryId/import/bgg
Sync games from a BoardGameGeek account. **Requires MEMBER role.**

**Request:**
```json
{
  "username": "bggusername",
  "password": "bggpassword",
  "importOwned": true,
  "importWantToPlay": false
}
```

**Response (201):**
```json
{
  "imported": 47,
  "skipped": 3,
  "message": "Imported 47 games from BGG"
}
```

**Errors:**
- `401` - Invalid BGG credentials
- `500` - BGG API timeout or error

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already registered",
    "details": {
      "field": "email"
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `INTERNAL_ERROR` (500)

---

## Role Enum Values

```
ADMIN  - Full access
MEMBER - Can add/edit games, borrow, create playlists
GUEST  - View only (for Wall Mode)
```

## Game Status Enum Values

```
AVAILABLE - On the shelf
BORROWED  - Lent out
STORAGE   - In storage/not accessible
```

