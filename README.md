# Mini Social Post App

A full-stack MERN social media application for the 3W Full Stack Internship Assignment.

## Features

- ✅ User authentication (signup/login with JWT)
- ✅ Create posts with text and/or images/videos
- ✅ Image/video file upload (Multer)
- ✅ Like posts (no duplicates)
- ✅ Comment on posts (username stored)
- ✅ Public feed with pagination
- ✅ Real-time UI updates
- ✅ Responsive design

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + MUI |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT |
| Upload | Multer |

## Project Structure

```
├── backend/
│   ├── models/       # User, Post schemas
│   ├── routes/       # Auth, Posts APIs
│   ├── middleware/   # Auth, Upload
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # PostCard, CreatePost, Navbar
│   │   ├── pages/       # Login, Signup, Feed
│   │   ├── context/     # AuthContext
│   │   └── services/    # API functions
│   └── .env
└── README.md
```

## Setup Instructions

### 1. Clone repository
```bash
git clone <repo-url>
cd 3W-intern-assingment-1
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-post-app
JWT_SECRET=your_secret_key
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run application
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User signup |
| POST | /api/auth/login | User login |
| GET | /api/posts?page=1&limit=10 | Get posts (paginated) |
| POST | /api/posts | Create post |
| PUT | /api/posts/:id/like | Toggle like |
| POST | /api/posts/:id/comment | Add comment |

## Database Schema

### Users Collection
```js
{ username, email, password, createdAt }
```

### Posts Collection
```js
{
  userId, content, image,
  likes: [userId],
  comments: [{ userId, username, text, createdAt }],
  createdAt
}
```

## Author

Jayakrishna

## License

MIT
