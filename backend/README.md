# Quantum Commerce Backend

This is the backend for the Quantum Commerce application built with Node.js, TypeScript, and Express.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables (see `.env.example`)

4. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Scripts

- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the production server
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run tests

### API Endpoints

- `GET /` - Health check endpoint
- More endpoints to be added as the project develops

### Tech Stack

- Node.js
- TypeScript
- Express
- MongoDB with Mongoose
- Cors
- Dotenv for environment variables