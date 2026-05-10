<div align="center">

# 🛡️ CyberSense AI
### AI-Based Cybercrime Complaint Analyzer

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A production-grade full-stack SaaS platform for AI-powered cybercrime complaint analysis, threat intelligence, and case management — built for India's digital security ecosystem.

</div>

---

## ✨ Features

- 🤖 **AI Threat Analysis** — Instantly classifies complaints with severity scoring (CRITICAL / HIGH RISK / MEDIUM) and actionable recommendations
- 🧙 **4-Step Complaint Wizard** — Guided form with crime type selection, evidence upload, and review step
- 📊 **Interactive Dashboard** — Live stats, Chart.js line & donut charts, animated SVG India threat map
- 🗂️ **Case Files Database** — Searchable, filterable, sortable table with CSV export
- 🔍 **Case Tracker** — Real-time timeline tracking of any complaint by Case ID
- 📚 **Awareness Module** — FAQ accordion on phishing, UPI fraud, malware prevention
- 💬 **AI Chat Sidebar** — Ask follow-up questions with typewriter AI responses
- 🔐 **JWT Authentication** — Secure login/register with bcrypt password hashing
- 🌗 **Dark / Light Theme** — Full theme switching + glassmorphism mode
- 📱 **Mobile Responsive** — Bottom navigation bar for mobile devices
- 🚨 **Emergency FAB** — One-tap call to India's Cybercrime Helpline (1930)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Chart.js |
| **Backend** | Node.js, Express.js, MVC Architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JWT, Bcryptjs |
| **Security** | Helmet, CORS, express-rate-limit |
| **Icons** | Tabler Icons |
| **Fonts** | Syne, Space Mono (Google Fonts) |

---

## 📁 Project Structure

```
cybersense/
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Header, BottomNav, StatsGrid, ChatSidebar
│   │   ├── context/           # AuthContext, AppContext, ToastContext
│   │   ├── pages/             # AnalyzePage, TrackerPage, CasesPage, InsightsPage, AwarenessPage
│   │   ├── services/          # Axios API service layer
│   │   ├── App.jsx
│   │   └── index.css          # Global styles & design system
│   └── index.html
├── backend/                   # Node.js + Express REST API
│   ├── config/                # MongoDB connection
│   ├── controllers/           # authController, complaintController
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # User, Complaint Mongoose schemas
│   ├── routes/                # authRoutes, complaintRoutes
│   └── server.js
├── _legacy/                   # Original HTML prototype (archived)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- [Git](https://git-scm.com)

### 1. Clone the repository
```bash
git clone https://github.com/Preetam4062/-AI-Based-Cybercrime-Complaint-Analyzer-.git
cd -AI-Based-Cybercrime-Complaint-Analyzer-
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybersense
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
```

Start the backend server:
```bash
npm run dev
```
✅ Backend running at `http://localhost:5000`

### 3. Setup the Frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new agent |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/auth/me` | Get current logged-in user |

### Complaints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/complaints` | Get all complaints for user | ✅ |
| `POST` | `/api/complaints` | Submit new complaint + AI analysis | ✅ |
| `GET` | `/api/complaints/stats` | Get dashboard statistics | ✅ |

---

## 🖥️ Screenshots

| Login Page | Complaint Wizard | AI Analysis Result |
|-----------|-----------------|-------------------|
| Dark mode with animated grid | 4-step guided form | Threat score + actions |

| Insights Dashboard | Case Tracker | Case Files |
|-------------------|-------------|------------|
| Live charts + threat map | Timeline tracking | Filterable data table |

---

## 🔒 Security Features

- ✅ Passwords hashed with **bcryptjs** (salt rounds: 12)
- ✅ **JWT tokens** with 30-day expiry
- ✅ **Helmet.js** — Sets secure HTTP headers
- ✅ **Rate limiting** — 100 requests per 15 minutes per IP
- ✅ **CORS** configured for frontend origin only
- ✅ `.env` file excluded from version control

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📞 Emergency Contact

If you are a victim of cybercrime in India:
- 📞 **National Cybercrime Helpline: 1930**
- 🌐 **Online Portal: [cybercrime.gov.in](https://cybercrime.gov.in)**
- 🛡️ **CERT-In: [cert-in.org.in](https://cert-in.org.in)**

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Built with ❤️ for a safer digital India 🇮🇳
</div>
