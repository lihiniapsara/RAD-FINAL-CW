
# 📚 Book Club Library App

A modern web app for managing books, readers, and lending in **Colombo's Book-Club Library** 📖✨

---

## 🧰 Tech Stack
- 🔹 React + TypeScript + Tailwind CSS (Frontend)
- 🔹 Node.js + Express + TypeScript (Backend)
- 🔹 MongoDB (Database)
- 🔹 JWT (Auth)
- 🔹 Nodemailer / SendGrid (Email)

---

## 🌟 Features

### 📘 Books
- View / Add / Edit / Delete

### 👤 Readers
- View / Add / Edit / Delete

### 📖 Lending
- Lend books
- Auto due date 🗓️
- Mark returns ✅
- View history

### ⚠️ Overdue
- Show overdue books & readers
- Email reminders ✉️

### 🔐 Auth
- JWT login for staff only 👩‍💼

---

## 📁 Structure

```
📦 book-club-library
├── frontend/     → React app
├── backend/      → Express API
└── README.md     → You're here!
```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env`:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/bookclub
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

---

## ✅ Done & Dusted

- ☑️ CRUD for books & readers
- ☑️ Lending & return system
- ☑️ Overdue detection
- ☑️ Email notifications
- ☑️ JWT auth
- ☑️ Mobile-friendly UI
- ☑️ Audit logging  



