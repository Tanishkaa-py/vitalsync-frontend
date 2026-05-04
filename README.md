# 🏥 VitalSync - React Frontend

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)

**Live App:** https://vitalsync-frontend-eight.vercel.app  
**Backend Repo:** [https://github.com/Tanishkaa-py/vitalsync-backend ](https://github.com/Tanishkaa-py/Week-14-Vital-sync) 
**Track:** Fullstack | **Intern:** Tanishka Jain | **Week:** 14 — ProDesk Internship

---

## 📋 Project Description

This is the **React frontend** for VitalSync, a healthcare patient dashboard application. It connects to a secure Node.js backend for authentication, stores JWTs in localStorage, and uses React Router to protect dashboard routes — redirecting unauthenticated users back to login automatically.

Built as part of the Week 14 Capstone milestone — the goal was to connect a React app to a real auth backend and implement route protection on the frontend.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing and navigation |
| **Axios** | HTTP client for API calls |
| **Context API** | Global authentication state |
| **localStorage** | JWT token persistence |
| **Vercel** | Production deployment |

---

## ✨ Features Built

### Milestone 2 — Frontend Connection
- **Register Form** — Name, email, password, role selection (Doctor/Patient)
- **Login Form** — Email, password, role selector UI
- **JWT Storage** — Token saved to localStorage on successful auth
- **Role-based Redirect** — Doctors go to `/doctor/dashboard`, patients to `/patient/dashboard`
- **Axios Instance** — Auto-attaches JWT to every request via interceptor

### Milestone 3 — Protected Frontend
- **ProtectedRoute Component** — Checks for JWT before rendering any dashboard
- **Auto-redirect** — Missing or expired token sends user to `/login` instantly
- **401 Interceptor** — Axios catches any 401 response, clears token, redirects to login
- **Logout** — Clears JWT from localStorage and redirects to login

### UI Features
- Patient Dashboard with stats, appointments, history timeline, prescriptions
- Doctor Dashboard with schedule, patient queue, availability toggle
- Live Protected API test button — calls backend and shows real response
- Fully responsive design with role-specific color themes (teal for patient, navy for doctor)

---

## 🗂️ Project Structure

```
vitalsync-frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx                    # React DOM entry point
    ├── App.jsx                     # Router + route definitions
    ├── index.css                   # Global styles + CSS variables
    ├── context/
    │   └── AuthContext.jsx         # Global auth state (login/register/logout)
    ├── components/
    │   └── ProtectedRoute.jsx      # JWT guard for protected pages
    ├── utils/
    │   └── api.js                  # Axios instance with interceptors
    └── pages/
        ├── Login.jsx               # Login page with role selector
        ├── Register.jsx            # Registration page
        ├── PatientDashboard.jsx    # Patient dashboard UI
        └── DoctorDashboard.jsx     # Doctor dashboard UI
```

---

## 🔄 Auth Flow

```
User submits Register/Login form
          ↓
Axios POST to backend /api/auth/register or /api/auth/login
          ↓
Backend returns { token, user }
          ↓
Token saved to localStorage as 'vitalsync_token'
User saved to localStorage as 'vitalsync_user'
          ↓
React Router redirects based on role:
  doctor → /doctor/dashboard
  patient → /patient/dashboard
          ↓
Every subsequent API call has:
  Authorization: Bearer <token>  (added by Axios interceptor)
          ↓
If token missing → ProtectedRoute redirects to /login
If token expired → Axios 401 interceptor redirects to /login
```

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Tanishkaa-py/vitalsync-frontend.git
cd vitalsync-frontend

# 2. Install dependencies
npm install

# 3. Create .env file
VITE_API_URL=http://localhost:5000

# 4. Run development server
npm run dev

# Open http://localhost:5173
```

> Make sure the backend is running on port 5000 before testing auth.

---

## ☁️ Deployment

**Deployed on Vercel:**
- Framework: Vite (auto-detected)
- Environment Variable: `VITE_API_URL=https://week-14-vital-sync.onrender.com`

**Live URL:** https://vitalsync-frontend-eight.vercel.app

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--teal` | `#0F6E56` | Patient portal primary |
| `--teal-light` | `#E1F5EE` | Patient portal surfaces |
| `--navy` | `#0C447C` | Doctor portal primary |
| `--navy-light` | `#E6F1FB` | Doctor portal surfaces |
| Font | DM Sans | All UI text |

---

<div align="center">
Built as part of the <strong>ProDesk Internship Capstone — Week 14</strong>
</div>
