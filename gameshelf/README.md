# GameShelf

A board game library manager for tracking, organizing, and sharing your tabletop collection.

## Features

- 📚 Manage multiple game libraries
- 🎲 Import games from BoardGameGeek
- 👥 Share libraries with friends and family
- 📋 Create playlists and smart lists
- 🔄 Track borrowing and returns
- 🔍 Natural language search ("2 player games under 30 min")

## Tech Stack

**Client:**
- React 18 + TypeScript
- Vite
- Zustand (state management)
- Framer Motion (animations)
- Lucide React (icons)

**Server:**
- Express + TypeScript
- Prisma (PostgreSQL ORM)
- JWT authentication
- node-cron (scheduled tasks)
- nodemailer (email notifications)

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- pnpm (recommended) or npm

### Development Setup

1. **Clone and install dependencies:**

```bash
cd gameshelf
cd client && npm install
cd ../server && npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start the database:**

```bash
docker compose up db -d
```

4. **Run database migrations:**

```bash
cd server
npm run db:push
```

5. **Start development servers:**

```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

The client will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

### Full Docker Development

```bash
docker compose up
```

## Project Structure

```
gameshelf/
├── client/           # React frontend
│   ├── src/
│   │   ├── api/      # API client functions
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/    # Zustand stores
│   │   └── styles/
│   └── ...
├── server/           # Express backend
│   ├── prisma/       # Database schema
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── types/
└── docs/             # Documentation
```

## API Documentation

See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for the full API specification.

## License

MIT

