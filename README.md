# Hidden Treasures Network

A platform to discover and share hidden treasures in your community.

## Project Overview

Hidden Treasures Network is a web application that enables users to discover, share, and explore hidden gems and treasures in their local communities.

## Project Structure

```
Hidden-Treasures-Network/
├── client/               # Frontend React application
│   ├── public/          # Static assets
│   └── src/             # Source code
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       ├── utils/       # Utility functions
│       ├── assets/      # Images, fonts, etc.
│       └── styles/      # CSS files
│
├── server/              # Backend Node.js/Express API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Custom middleware
│   │   └── utils/       # Utility functions
│   └── tests/           # Server tests
│
├── shared/              # Shared code between client and server
│   ├── types/           # Shared type definitions
│   └── constants/       # Shared constants
│
├── docs/                # Documentation
├── config/              # Configuration files
└── tests/               # Integration tests
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for backend database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Hidden-Treasures-Network
```

2. Install dependencies for both client and server:
```bash
npm run install:all
```

Or install individually:
```bash
npm run install:client
npm run install:server
```

3. Set up environment variables:
```bash
cp server/.env.example server/.env
```
Edit `server/.env` with your configuration.

### Running the Application

Start both client and server concurrently:
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Start server
npm run start:server

# Terminal 2 - Start client
npm run start:client
```

The client will be available at `http://localhost:3000`
The server will be available at `http://localhost:5000`

## Available Scripts

- `npm run install:all` - Install all dependencies
- `npm start` - Run both client and server
- `npm run start:client` - Run client only
- `npm run start:server` - Run server only
- `npm run build:client` - Build client for production
- `npm test` - Run all tests

## Technology Stack

### Frontend
- React 18
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

## Documentation

Additional documentation can be found in the `/docs` folder.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
