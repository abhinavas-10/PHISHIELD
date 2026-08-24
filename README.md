<div align="center">

# 🛡️ PHISHIELD

### AI-Powered Phishing URL Detection System

<p>
An end-to-end full-stack application that analyzes URLs and uses
Machine Learning to identify potential phishing threats.
</p>

<br />

<a href="https://phishield-gamma.vercel.app">
  <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_PHISHIELD-000?style=for-the-badge" />
</a>

<a href="https://phishield-rcd2.onrender.com/api/health">
  <img src="https://img.shields.io/badge/⚙️_Backend_API-Render-000?style=for-the-badge" />
</a>

<br /><br />

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-API-000000?style=flat-square&logo=flask)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=flat-square&logo=render)

</div>

---

# 🌐 Live Application

<div align="center">

| Service | Platform | Live URL |
| :--- | :--- | :--- |
| 🎨 **Frontend** | Vercel | [Launch PHISHIELD](https://phishield-gamma.vercel.app) |
| ⚙️ **Backend API** | Render | [Open API](https://phishield-rcd2.onrender.com/api/predict) |
| ❤️ **API Health Check** | Render | [Check Status](https://phishield-rcd2.onrender.com/api/health) |

</div>

> **Architecture:** The React frontend is deployed on **Vercel**, while the Python Flask backend and Machine Learning prediction service are deployed separately on **Render**.

---

# 🛠️ Tech Stack

<div align="center">

## 🎨 Frontend

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind" />

<br /><br />

**React • TypeScript • Vite • Tailwind CSS**

<br /><br />

---

## ⚙️ Backend

<img src="https://skillicons.dev/icons?i=python,flask" />

<br /><br />

**Python • Flask • REST API • Gunicorn**

<br /><br />

---

## 🤖 Machine Learning & Data

<img src="https://skillicons.dev/icons?i=python" />

<br /><br />

**Scikit-learn • Pandas • NumPy**

<br /><br />

---

## 🗄️ Database

<img src="https://skillicons.dev/icons?i=sqlite" />

<br /><br />

**SQLite • SQLAlchemy**

<br /><br />

---

## ☁️ Deployment

<img src="https://skillicons.dev/icons?i=vercel" />

<br /><br />

**Vercel — Frontend**  
**Render — Python Flask Backend**

<br /><br />

---

## 🔧 Development Tools

<img src="https://skillicons.dev/icons?i=git,github,vscode" />

<br /><br />

**Git • GitHub • VS Code**

</div>

---

# 📌 Overview

**PHISHIELD** is an end-to-end phishing URL detection system designed to help users identify potentially malicious websites.

The application combines a modern **React + TypeScript frontend**, a **Python Flask REST API**, a **Machine Learning classification model**, and **SQLite database storage**.

Users enter a URL through the frontend. The request is sent to the Flask backend, where the URL is validated and processed. Security-related features are extracted and passed to the trained Machine Learning model for prediction.

The backend returns the result as JSON, and the frontend displays the security analysis to the user.

---

# 🔄 How It Works

```text
┌──────────────────┐
│       USER       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│       PHISHIELD FRONTEND     │
│                              │
│   React + TypeScript         │
│   Vite + Tailwind CSS        │
└──────────────┬───────────────┘
               │
               │ POST /api/predict
               │
               ▼
┌──────────────────────────────┐
│        FLASK REST API        │
│                              │
│        Python Backend        │
│        Deployed on Render    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      URL PROCESSING          │
│                              │
│  • URL Validation            │
│  • Feature Extraction        │
│  • Security Analysis         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     MACHINE LEARNING MODEL   │
│                              │
│     Classification Model     │
│                              │
│     Safe / Phishing          │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       JSON API RESPONSE      │
│                              │
│  • Prediction                │
│  • Confidence                │
│  • Risk Level                │
│  • Security Signals          │
│  • Summary                   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       RESULTS DASHBOARD      │
│                              │
│  React displays the result   │
└──────────────────────────────┘
