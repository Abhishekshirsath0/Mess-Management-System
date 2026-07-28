# 🍽️ Mess Management System

A full-stack **Mess Management System** designed to simplify and automate mess operations for students and administrators. The system helps manage student records, attendance, meal tracking, payments, and daily menus efficiently.

The platform provides separate functionalities for **Admin** and **Students**, reducing manual work and improving mess management transparency.

---

## 🚀 Features

### 👨‍💼 Admin Panel

- Admin authentication and secure login
- Manage student details
- Add, update, and delete meal menus
- Manage daily lunch and dinner menus
- Track student attendance
- View monthly attendance reports
- Manage meal availability
- Monitor payment records
- Dashboard with mess statistics

---

### 👨‍🎓 Student Panel

- Student registration and login
- View daily meal menu
- Check attendance history
- View meal records
- Track payment status
- Profile management

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

### Tools

![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)
![VS Code](https://img.shields.io/badge/VS%20Code-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)

---

# 📂 Project Structure

```
Mess-Management-System
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/yourusername/Mess-Management-System.git
```

Go inside project:

```bash
cd Mess-Management-System
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend will start at:

```
http://localhost:5173
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm start
```

Backend will run at:

```
http://localhost:8000
```

---

# 🔐 Authentication

The system uses:

- JWT Authentication
- Password Encryption using bcrypt
- Protected API routes
- Role-based access control

---

# 📊 Database Collections

### Users Collection

Stores:

- Student information
- Admin information
- Login credentials
- Profile details


### Attendance Collection

Stores:

- Student ID
- Date
- Meal type
- Attendance status


### Meals Collection

Stores:

- Date
- Day
- Lunch menu
- Dinner menu
- Veg / Non-Veg items


### Payments Collection

Stores:

- Student payments
- Monthly records
- Payment status

---

# 🔮 Future Enhancements

- 📱 Mobile application
- 💳 Online payment integration
- 🤖 AI-based meal prediction
- 📊 Advanced analytics dashboard
- 🔔 Notification system
- QR-based attendance system
- AI chatbot for student queries

---

# 👨‍💻 Developer

**Abhishek Shirsath**

B.Tech Computer Engineering Student  
Full Stack Developer | MERN Stack | AI Enthusiast

GitHub:
https://github.com/Abhishekshirsath0

LinkedIn:
Add your LinkedIn profile

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
