# GameShelf Agent Prompts

Use these prompts to coordinate multiple Cursor agents working on GameShelf.

---

## Workflow Order

```
1. Run SCAFFOLD AGENT first (creates structure)
         ↓
2. Run BACKEND + FRONTEND agents in parallel
         ↓
3. Run INTEGRATION AGENT last (connects everything)
```

---

## AGENT 0: Scaffold (Run First - 5 minutes)

Copy this entire prompt:

```
You are setting up the initial project structure for GameShelf, a board game library manager.

Create the following folder structure and configuration files ONLY (no implementation code yet):

gameshelf/
├── client/
│   ├── package.json (React 18, Vite, TypeScript, Zustand, Framer Motion, Axios, Lucide React)
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx (minimal entry)
│       ├── App.tsx (placeholder)
│       ├── api/ (empty)
│       ├── components/ (empty)
│       ├── pages/ (empty)
│       ├── hooks/ (empty)
│       ├── store/ (empty)
│       └── styles/ (empty)
│
├── server/
│   ├── package.json (Express, TypeScript, Prisma, bcryptjs, jsonwebtoken, node-cron, nodemailer, cors)
│   ├── tsconfig.json
│   ├── prisma/schema.prisma (full schema from API contract)
│   └── src/
│       ├── index.ts (placeholder)
│       ├── routes/ (empty)
│       ├── controllers/ (empty)
│       ├── services/ (empty)
│       ├── middleware/ (empty)
│       └── types/ (empty)
│
├── docker-compose.yml (dev config)
├── docker-compose.prod.yml (prod with cloudflared)
├── .env.example
├── .gitignore
└── README.md

IMPORTANT:
- Read docs/API_CONTRACT.md for the Prisma schema
- Create proper package.json with all dependencies
- Set up tsconfig.json for both modules
- Docker compose should define client, server, and volumes
- .env.example should list all required variables

Do NOT implement any business logic. Just create the structure and configs.
```

---

## AGENT 1: Backend Developer

Copy this entire prompt:

```
You are the BACKEND DEVELOPER for GameShelf, a board game library manager.

YOUR SCOPE: Only work in the server/ directory. Do not touch client/.

REFERENCE: Read docs/API_CONTRACT.md - this is your specification. Implement all endpoints exactly as defined.

TECH STACK:
- Express + TypeScript
- Prisma ORM with SQLite
- JWT authentication (jsonwebtoken)
- bcryptjs for password hashing
- node-cron for scheduled jobs
- nodemailer for emails

IMPLEMENTATION ORDER:

1. **src/index.ts & src/app.ts**
   - Express app setup with CORS, JSON parsing
   - Mount all routes under /api
   - Error handling middleware

2. **src/config/env.ts**
   - Load and validate environment variables
   - Export typed config object

3. **src/middleware/auth.middleware.ts**
   - JWT verification middleware
   - Attach user to request

4. **src/middleware/rbac.middleware.ts**
   - Check user's role in library
   - Export: requireRole('ADMIN'), requireRole('MEMBER'), etc.

5. **src/routes/ and src/controllers/**
   - auth.routes.ts + auth.controller.ts (register, login, me)
   - library.routes.ts + library.controller.ts
   - game.routes.ts + game.controller.ts
   - borrow.routes.ts + borrow.controller.ts
   - playlist.routes.ts + playlist.controller.ts
   - bgg.routes.ts + bgg.controller.ts

6. **src/services/**
   - auth.service.ts (password hashing, JWT generation)
   - game.service.ts (CRUD, search logic)
   - bgg.service.ts (fetch from BGG XML API, parse response)
   - email.service.ts (SendGrid integration)
   - search.service.ts (natural language query parsing)

7. **src/jobs/reminder.job.ts**
   - Cron job that runs daily
   - Find overdue borrows, send reminder emails

8. **Dockerfile**
   - Multi-stage build
   - Run Prisma migrations on start

CODING STANDARDS:
- Use async/await, proper error handling
- Validate all inputs
- Return proper HTTP status codes
- Follow the exact response shapes in API_CONTRACT.md

TEST AS YOU GO:
- After auth routes: test with curl/Postman
- After game routes: verify CRUD works
- After BGG: test search functionality

Do not implement anything outside server/. The frontend team is handling client/.
```

---

## AGENT 2: Frontend Developer

Copy this entire prompt:

```
You are the FRONTEND DEVELOPER for GameShelf, a board game library manager.

YOUR SCOPE: Only work in the client/ directory. Do not touch server/.

REFERENCE: Read docs/API_CONTRACT.md - this defines all API endpoints you'll consume.

TECH STACK:
- React 18 + TypeScript
- Vite for building
- Zustand for state management
- Framer Motion for animations
- Axios for API calls
- Lucide React for icons

DESIGN SYSTEM:
- Font (headings): Outfit
- Font (body): DM Sans  
- Primary bg: #0a0f1c (deep navy)
- Accent: #f59e0b (amber)
- Success: #34d399 (mint)
- Create src/styles/variables.css with CSS custom properties

IMPLEMENTATION ORDER:

1. **src/styles/**
   - variables.css (colors, typography, spacing)
   - global.css (reset, base styles, scrollbars)

2. **src/api/**
   - client.ts (Axios instance with auth interceptor)
   - types.ts (TypeScript types matching API_CONTRACT.md)
   - auth.ts, games.ts, libraries.ts, import.ts, etc. (API functions)

3. **src/store/**
   - authStore.ts (user, token, login/logout actions)
   - uiStore.ts (sidebar state, current view, modals)

4. **src/hooks/**
   - useAuth.ts (authentication state and guards)
   - useDebounce.ts (for search input)

5. **src/components/ui/**
   - Button, Input, Modal, Rating, StatusBadge
   - Keep them generic and reusable

6. **src/components/layout/**
   - Layout.tsx (main shell)
   - Sidebar.tsx (desktop navigation)
   - MobileNav.tsx (bottom navigation)

7. **src/pages/**
   - Login.tsx, Register.tsx
   - Home.tsx (hero, recent games, sections)
   - Library.tsx (grid/list/table views, filters)
   - GameDetail.tsx (modal with full info)
   - WallMode.tsx (full-screen coverflow)
   - Playlists.tsx
   - AddGames.tsx (import wizard - see below)

8. **src/components/game/**
   - GameCard.tsx (grid item)
   - GameList.tsx (list item)
   - GameTable.tsx (table row)
   - GameDetail.tsx (modal content)

9. **src/components/import/** (NEW - Game Import Wizard)
   - ImportWizard.tsx (main container with tabs/steps)
   - ManualSearch.tsx (autocomplete game search)
   - BulkUpload.tsx (textarea/file upload for game list)
   - BggSync.tsx (BGG login form)
   - ImportPreview.tsx (review matched games before confirming)

10. **src/components/coverflow/**
    - Coverflow.tsx (3D carousel with Framer Motion)
    - Touch gestures with useDrag

11. **src/utils/search.ts**
    - Parse natural language queries
    - Extract: playerCount, maxPlaytime, categories, status

GAME IMPORT FEATURE (3 Methods):

The backend supports 3 ways to add games. Build UI for all 3:

**Method 1: Manual Search with Autocomplete**
- GET /api/import/search?q=wingspan
- Returns: { results: [{ bggId, title, yearPublished }] }
- UI: Search input with dropdown suggestions
- User selects a game → add to library

**Method 2: Bulk Upload**
- Step 1: POST /api/import/preview with { content: "Game1\nGame2\nGame3" }
- Returns: { total, matched, unmatched, games: [{ input, matched, confidence, game, suggestions }] }
- UI: Textarea for pasting game list (supports CSV, numbered lists, plain text)
- Show preview table with match status, let user correct unmatched games
- Step 2: POST /api/libraries/:id/import/bulk with confirmed games

**Method 3: BGG Account Sync**
- POST /api/libraries/:id/import/bgg
- Body: { username, password, importOwned: true, importWantToPlay: false }
- Returns: { imported, skipped, message }
- UI: BGG login form with checkboxes for what to import
- Show progress/results after sync

MOCK DATA:
Until the backend is ready, create src/api/mock.ts with sample data so you can develop the UI. Use an environment variable to toggle between mock and real API.

CODING STANDARDS:
- Functional components with hooks
- CSS Modules for component styles
- Proper TypeScript types (no `any`)
- Responsive design (mobile-first)

VISUAL QUALITY:
- Smooth animations (Framer Motion)
- Loading states and skeletons
- Error states with retry options
- Accessible (keyboard nav, ARIA labels)

Do not implement anything outside client/. The backend team is handling server/.
```

---

## AGENT 3: Integration & DevOps (Run Last)

Copy this entire prompt:

```
You are the INTEGRATION & DEVOPS engineer for GameShelf.

YOUR SCOPE: 
- Root-level configuration files
- Docker setup
- Connecting frontend to backend
- Final testing and documentation

TASKS:

1. **Verify API Contract**
   - Ensure server/ implements all endpoints in docs/API_CONTRACT.md
   - Ensure client/ consumes all endpoints correctly
   - Fix any mismatches

2. **Docker Configuration**
   
   client/Dockerfile:
   - Multi-stage: node for build, nginx for serve
   - Copy nginx.conf for SPA routing
   
   server/Dockerfile:
   - Multi-stage: node for build, node-slim for run
   - Run prisma migrate on startup
   
   docker-compose.yml (development):
   - client on port 3000
   - server on port 4000
   - Volume for SQLite database
   - Environment variables from .env
   
   docker-compose.prod.yml:
   - Add cloudflared service for tunnel
   - Production optimizations
   - Restart policies

3. **client/nginx.conf**
   - Serve static files
   - SPA fallback to index.html
   - Proxy /api to backend service

4. **Environment Setup**
   - .env.example with all variables documented
   - .env.local for development defaults

5. **Playlists Feature** (both modules)
   - If not complete, implement playlist CRUD
   - Smart playlist logic (server-side filtering)
   - Playlist UI (client-side)

6. **Testing**
   - Run `docker-compose up --build`
   - Test full flow: register → create library → add game → borrow → return
   - Test Wall Mode access
   - Verify email would send (check logs)

7. **Documentation**
   - README.md with setup instructions
   - Deployment guide for Raspberry Pi
   - Cloudflare Tunnel setup steps

FOCUS ON:
- Making deployment foolproof
- Clear error messages
- Proper logging
- Security (CORS, rate limiting basics)
```

---

## Coordination Tips

### 1. Start with Scaffold
Run Agent 0 first to create the structure. Wait for it to complete before starting others.

### 2. API Contract is Law
Both backend and frontend agents reference `docs/API_CONTRACT.md`. If you need to change the API:
1. Update the contract first
2. Tell both agents about the change

### 3. Check for Conflicts
If both agents edit the same file (they shouldn't), resolve manually:
```bash
git status
git diff
```

### 4. Test Integration Early
Once backend has auth + games working, have frontend agent switch from mocks to real API.

### 5. Communication via Files
Agents can leave notes for each other:
- `docs/BACKEND_STATUS.md` - "Auth complete, games in progress"
- `docs/FRONTEND_STATUS.md` - "UI done, waiting for API"

---

## Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

**Terminal 3 - Full Stack (Docker):**
```bash
docker-compose up --build
```

