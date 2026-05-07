# 🤖 AI Prompts Log - VitalSync Frontend

This file documents every AI prompt used during the development of the VitalSync React frontend. Maintained for transparency, learning, and internship evaluation purposes.

---

## Purpose

This project was built with AI assistance as a learning tool. Every significant prompt is logged here to show the thought process, what was asked, why it was asked, and what was learned from the output.

---

## Prompt Log

---

### Prompt 1 — Project & Tech Stack Selection

**Tool:** Claude (Anthropic)  
**Week:** 13 — Planning Phase  
**Prompt:**
```
I am a fullstack intern at intermediate UI level. Which of these three
capstone projects should I choose: EduCore (LMS), VitalSync (Healthcare
Dashboard), or TaskMatrix (Project Management Tool)? Explain which is
best for my resume and for demonstrating fullstack skills.
```
**What it helped with:** Choosing VitalSync as the strongest option for
a fullstack intermediate developer and understanding why healthcare dashboards
stand out in intern portfolios.

**What I learned:** How to evaluate project choices based on technical
complexity, resume impact, and alignment with skill level.

---

### Prompt 2 — Auth Context with React Context API

**Tool:** Claude (Anthropic)  
**Week:** 14 — Milestone 2  
**Prompt:**
```
Build a React Context for authentication in a healthcare app. It needs
login, register, and logout functions. On login/register, save the JWT
and user object to localStorage. On app load, restore from localStorage.
Use a custom useAuth hook for easy access.
```
**What it helped with:** Writing the AuthContext and AuthProvider with
the `useEffect` to restore session from localStorage on page refresh.

**What I learned:** How React Context works with Provider/Consumer pattern,
why `useEffect` with an empty dependency array runs only once on mount,
and how to build custom hooks that wrap useContext.

---

### Prompt 3 — Axios Interceptors

**Tool:** Claude (Anthropic)  
**Week:** 14 — Milestone 2  
**Prompt:**
```
Create an Axios instance for a React app that automatically attaches a
JWT from localStorage to every request's Authorization header. Also add
a response interceptor that catches 401 errors, clears localStorage,
and redirects to /login.
```
**What it helped with:** Writing the `api.js` utility with both request
and response interceptors so I never have to manually add auth headers.

**What I learned:** What Axios interceptors are, why they're better than
adding headers manually to each request, and how the request/response
lifecycle works in Axios.

---

### Prompt 4 — Protected Route Component

**Tool:** Claude (Anthropic)  
**Week:** 14 — Milestone 3  
**Prompt:**
```
Build a ProtectedRoute component in React Router v6 that checks for a
JWT in localStorage. If no token exists, redirect to /login using Navigate.
If token exists, render the children. Show a loading spinner while checking.
```
**What it helped with:** Writing the ProtectedRoute wrapper and understanding
how to use React Router v6's `<Navigate>` component for programmatic redirects.

**What I learned:** The difference between React Router v5 and v6 (Navigate
vs Redirect), how to wrap routes with layout components, and why checking
auth state during loading prevents flash of protected content.

---

### Prompt 5 — Login and Register Forms

**Tool:** Claude (Anthropic)  
**Week:** 14 — Milestone 2  
**Prompt:**
```
Build a Login page in React for a healthcare app called VitalSync. It
needs a role selector (Doctor/Patient as clickable cards), email and
password fields, error display, loading state on the button, and redirect
to /patient/dashboard or /doctor/dashboard based on the user's role after
login. Use inline styles with the teal color #0F6E56.
```
**What it helped with:** Building the Login and Register pages with role
selection, form state management, error handling, and role-based redirects.

**What I learned:** How to manage multiple form fields with a single state
object using spread operator, how to show/hide error messages conditionally,
and how `useNavigate` works in React Router v6.

---

### Prompt 6 — Patient & Doctor Dashboards

**Tool:** Claude (Anthropic)  
**Week:** 14 — UI  
**Prompt:**
```
Build a Patient Dashboard in React that shows: a greeting with the user's
name from AuthContext, 4 stat cards (upcoming appointments, prescriptions,
past visits, blood type), upcoming appointment cards with date blocks and
status badges, a medical history timeline, and active prescriptions. Also
add a button that calls the protected /api/patients endpoint and displays
the JSON response to prove auth is working.
```
**What it helped with:** Building the full dashboard layout with sidebar
navigation, stat cards, timeline components, and the live API test feature.

**What I learned:** How to use CSS Grid for dashboard layouts, how to pull
user data from Context in a child component, and how to show API responses
in the UI for debugging/demo purposes.

---

### Prompt 7 — Debugging Blank White Page

**Tool:** Claude (Anthropic)  
**Week:** 14 — Debugging  
**Prompt:**
```
My React Vite app shows a blank white page at localhost:5173. The console
only shows a favicon 404 error. What are the most common causes and how
do I debug this?
```
**What it helped with:** Identifying that `vite.config.js` was empty and
not exporting a config object, which prevented Vite from starting properly.

**What I learned:** How Vite's config file works, what `defineConfig` does,
and how to read browser console errors to distinguish between Vite errors
and React rendering errors.

---

### Prompt 8 — CORS Error on Deployed App

**Tool:** Claude (Anthropic)  
**Week:** 14 — Deployment  
**Prompt:**
```
My React frontend on Vercel gets a CORS error when calling my Express
backend on Render. The error says the Access-Control-Allow-Origin header
value does not equal the supplied origin. How do I fix this?
```
**What it helped with:** Understanding that the FRONTEND_URL environment
variable on Render had to exactly match the actual Vercel deployment URL.

**What I learned:** How CORS works at the HTTP level, what preflight
OPTIONS requests are, and why environment variables on different platforms
(Vercel vs Render) need to be updated independently when URLs change.

---

## Summary

| Prompt | Purpose | Milestone |
|---|---|---|
| 1 | Project selection | Planning |
| 2 | Auth Context | Milestone 2 |
| 3 | Axios interceptors | Milestone 2 |
| 4 | Protected Route | Milestone 3 |
| 5 | Login/Register forms | Milestone 2 |
| 6 | Dashboards | UI |
| 7 | Blank page debug | Debugging |
| 8 | CORS fix | Deployment |

---

*All code was reviewed, understood, and manually typed/modified , not blindly copied.*
