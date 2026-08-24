<div align="center">

# 🛡️ PHISHIELD

### AI-Powered Phishing URL Detection System

A full-stack web application that analyzes URLs and uses Machine Learning to detect potential phishing threats.
# 🛠️ Tech Stack

<div align="center">

### Frontend

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind" />

<br /><br />

### Backend

<img src="https://skillicons.dev/icons?i=python,flask" />

<br /><br />

### Machine Learning & Data

<img src="https://skillicons.dev/icons?i=python" />

<br />

**Scikit-learn • Pandas • NumPy**

<br /><br />

### Database

<img src="https://skillicons.dev/icons?i=sqlite" />

<br /><br />

### Deployment

<img src="https://skillicons.dev/icons?i=vercel" />

<br />

**Vercel • Render**

<br /><br />

### Tools

<img src="https://skillicons.dev/icons?i=git,github,vscode" />

</div>

<br />

[Live Demo](https://phishield-gamma.vercel.app) •
[Backend API](https://phishield-rcd2.onrender.com/api/predict)

</div>

---

## 📌 Overview

**PHISHIELD** is an end-to-end phishing URL detection system designed to help users identify potentially malicious websites.

Users can enter a URL through a modern web interface. The URL is sent to a Python Flask REST API, where it is processed and analyzed using a trained Machine Learning classification model.

The system returns a security assessment including:

- 🛡️ Safe or Phishing prediction
- 📊 Confidence score
- ⚠️ Risk level
- 🔍 Security signals
- 📝 Analysis summary
- 📜 Scan history and dashboard statistics

---

## 🚀 Live Demo

🌐 **Frontend:**  
https://phishield-gamma.vercel.app

⚙️ **Backend API:**  
https://phishield-rcd2.onrender.com/api/predict

> **Note:** The backend is deployed separately from the frontend.

---

## 🏗️ System Architecture

```text
                    ┌───────────────┐
                    │     USER      │
                    └───────┬───────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   React + TypeScript    │
              │       Frontend          │
              └───────────┬─────────────┘
                          │
                     REST API
                          │
                          ▼
              ┌─────────────────────────┐
              │      Flask Backend      │
              │      Python REST API    │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │    URL Validation &     │
              │   Feature Extraction    │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │   Machine Learning      │
              │        Model            │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │ Prediction + Confidence │
              │   Risk + Security Info  │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │ React Results Dashboard │
              └─────────────────────────┘
