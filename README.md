# Smart Recruitment System

A smart recruitment system built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** . This platform is designed to streamline the recruitment process by connecting **job seekers**, **recruiters**, and **admins** in a centralized and efficient system.

---

## 🧠 Features

### 👤 Job Seekers
- Browse and search job listings
- Apply for jobs directly
- Save jobs to a personal dashboard
- Edit and update profile information

### 🧑‍💼 Recruiters
- Post and manage job listings
- View applicants for each job
- Manage company information
- Dashboard with job metrics

### 🛡️ Super Admin
- Approve or disapprove recruiter accounts
- Manage all users (job seekers and recruiters)
- Monitor job postings and companies
- Block or unblock accounts
- Platform analytics (user counts, job trends, etc.)

---

## 🏗️ Tech Stack

| Frontend        | Backend           | Database         | Others                  |
|----------------|-------------------|------------------|--------------------------|
| React.js        | Node.js, Express  | PostgreSQL / MongoDB | JWT, Redux, Tailwind CSS, Framer Motion |

---

## 📁 Project Structure

```bash
smart-recruitment-system/
│
├── Backend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│
├── Frontend/                 # Node + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
└── README.md
