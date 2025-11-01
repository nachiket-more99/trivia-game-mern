# TriviaGame - Full Stack Dev Quiz

A full stack trivia game focused on web development topics. Built with a MERN stack + FastAPI microservice, containerized with Docker, and secured with Auth0 authentication.

## Tech Stack

**Frontend**
- React + TypeScript
- Bootstrap + custom CSS
- Auth0 for authentication

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose

**Microservice**
- Python + FastAPI
- PyMongo

**Infrastructure**
- Docker + Docker Compose

## Features

- Dark-themed UI with responsive layout
- Auth0 login / signup
- Interactive quiz with 5 full stack questions (React, Node.js, Docker, MongoDB and more)
- Live progress bar and score tracker during gameplay
- Green/red answer feedback with correct answer reveal
- Dynamic end screen based on score and completion time
- Leaderboard with trophy icons for top 3, sorted by score then fastest time
- Only best score per user is kept on the leaderboard
- Current user highlighted on leaderboard

## Run Locally

Make sure Docker Desktop is running, then:
```bash
git clone https://github.com/nachiket-more99/trivia-game-mern.git
cd trivia-game-mern
docker compose up
```

Open `http://localhost:3000` in your browser.

## API Endpoints

**Express backend - port 3001**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/question/list` | Get all questions |
| POST | `/question/create` | Create a question |
| GET | `/question/:id` | Get question by ID |
| PATCH | `/question/:id` | Update question |
| DELETE | `/question/:id` | Delete question |

**FastAPI microservice - port 8000**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get leaderboard (sorted by score, time) |
| POST | `/` | Submit score (keeps best score per user) |
| PUT | `/{id}` | Update record |
| DELETE | `/{id}` | Delete record |

## Contact

Nachiket More - nachiketmore.more@gmail.com