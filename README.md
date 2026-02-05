# TechLearn Course Topics — Full Stack Recreation

This project is a full-stack recreation of the TechLearn Course Topics page, built as part of the Round 1 technical interview task.

The goal was to reverse engineer the original product behavior, rebuild it from scratch, remove UX issues, and deploy a clean end-to-end working application.

---

## 🔗 Live Application

Frontend (Primary App):  
👉 https://techlearn-full-stack-developer.vercel.app/

Backend API Base URL:  
👉 https://techlearn-backend-yx5o.onrender.com

Health Check Endpoint:  
👉 https://techlearn-backend-yx5o.onrender.com/health

---

## ✅ Task Requirements — Implementation Summary

### ✔ Reverse Engineered Course Topics Page
- Sidebar topic navigation
- Topic selection and rendering
- Next / Previous topic navigation
- Dynamic topic + note loading from backend

### ✔ Removed Nested Scrolling
- Notes content scrolls naturally with the page
- No inner scroll containers

### ✔ Removed Quiz / Checkpoint Logic
- Navigation is uninterrupted
- Clean learning flow

### ✔ Full Stack Integration
- React frontend consuming backend API
- Express backend with database persistence
- Production database seeded with course content

---

## 🧠 Features

- Course + topic navigation system
- Dynamic content rendering
- Smooth topic switching
- Error-safe loading states
- Production-ready API communication
- Environment-based configuration (no hardcoded URLs)

---

## 🛠 Tech Stack

Frontend:
- React + Vite
- React Router
- Axios

Backend:
- Node.js
- Express
- Prisma ORM

Database:
- Neon PostgreSQL

Deployment:
- Vercel (Frontend)
- Render (Backend)

---

## 🔄 API Overview

Example endpoints:

```
GET /courses
GET /courses/:courseId/topics
GET /topics/:topicId
GET /health
```

All data is fetched dynamically from the backend — nothing is hardcoded.

---

## ⚙ Environment Configuration

Frontend:

```
VITE_API_URL=https://YOUR-RENDER-BACKEND.onrender.com
```

Backend:

```
DATABASE_URL=your_neon_database_url
PORT=5000
```

---

## 🚀 Deployment Notes

- Backend auto-connects to Neon database
- Production database seeded with demo course content
- App works end-to-end without local setup

Reviewer can immediately open the frontend link and test navigation.

---

## 📌 Assumptions / Notes

- Pixel-perfect UI was not required — functionality was prioritized
- Focus was placed on UX improvements and architecture clarity
- Backend health endpoint added for quick verification

---

## 👨‍💻 Author

Chiguru Rahul  
Full Stack Developer Candidate — TechLearn Round 1 Task

---

## ✅ Reviewer Quick Test Guide

1. Open frontend link
2. Click topics in sidebar
3. Use Next / Previous buttons
4. Confirm notes scroll naturally
5. Visit backend `/health` endpoint

Everything should work instantly — no setup required.
