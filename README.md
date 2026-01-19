# CVWO-Assignment-2026

## Getting started
### .env File
Due to safety reasons, I have included the .env contents into my CVWO write-up.
Please add the .env file into the backend folder.

### Backend
```bash
cd backend
docker compose build
docker compose up
```
### Frontend
```bash
cd frontend
npm i
npm run dev
```
### URLs
Frontend home page: `http://localhost:3000` (redirects to `http://localhost:3000/home`)
Backend API URL: `http://localhost:8080`

## File Structure
```text
CVWO-Assignment-2026
├─ backend
│  ├─ cmd/server
│  │  └─ main.go
│  ├─ db
│  │  ├─ 001.init.sql
│  │  └─ 002_seed_dev.sql
│  ├─ internal
│  │  ├─ handlers
│  │  ├─ models
│  │  ├─ types
│  │  └─ middleware
│  ├─ go.mod
│  ├─ go.sum
│  ├─ docker-compose.yml
│  └─ Dockerfile
├─ frontend
│  ├─ src
│  │  ├─ pages
│  │  ├─ components
│  │  ├─ main.tsx
│  │  ├─ App.tsx
│  │  ├─ Auth.tsx
│  │  └─ index.css
│  ├─ types
│  ├─ index.html
│  ├─ package.json
│  ├─ vite.config.json
│  ├─ tailwind.config.ts
│  └─ postcss.config.cjs
├─ .gitignore
└─ README.md
```

## AI Usage
Tool: ChatGPT
Purpose (In order of frequency): 
- Debugging code in general
- Learning and understanding Golang
- Debugging and researching how to connent and run my backend and postgreSQL with Docker
- Debugging and researching how to connect the frontend to the backend endpoints 
(Had an issue with vite auto-adding trailing slashes to the endpoint routes I was calling.) 
- Researching how to set-up Tailwind CSS
- Researching the backend structure (router -> handler -> model)
- Researching creating my SQL database schema (eg. using auto-increment ID vs UUID, checking if my schema is 3NF)
- Generating dummy objects for my database seed