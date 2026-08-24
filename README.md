<div align="center">

# 🛡️ PHISHIELD

### AI-Powered Phishing URL Detection System

A full-stack web application that analyzes URLs and predicts whether they are **Safe** or potentially **Phishing** using Machine Learning.

<br />

![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=for-the-badge&logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-URL%20Detection-orange?style=for-the-badge)

</div>

---

## 📌 Overview

**PHISHIELD** is an end-to-end phishing URL detection system that combines modern web development with Machine Learning.

Users can enter a website URL and analyze it for potential phishing characteristics. The frontend communicates with a Python Flask REST API, which processes the URL and uses a trained Machine Learning model to generate a prediction.

The system returns information such as:

- 🛡️ Safe or Phishing prediction
- 📊 Prediction confidence
- ⚠️ Risk level
- 🔍 Security signals
- 📝 Scan summary
- 📚 Scan history
- 📈 Dashboard statistics

---

# ✨ Features

## 🔍 URL Scanner

Users can enter a URL and receive a phishing detection result.

```text
https://example.com
        ↓
URL Validation
        ↓
Feature Extraction
        ↓
Machine Learning Model
        ↓
Safe / Phishing Prediction
        ↓
Result Displayed
