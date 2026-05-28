# Excel Core Bank Management System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Java Version](https://img.shields.io/badge/Java-17%2B-blue?style=flat-square\&logo=java)
![Framework](https://img.shields.io/badge/Framework-Spring%20Boot%203.2-spring?style=flat-square\&logo=springboot)
![Database Engine](https://img.shields.io/badge/Database-Apache%20POI%20Excel-green?style=flat-square\&logo=microsoft-excel)
![Deployment](https://img.shields.io/badge/Deployment-Render%20%2B%20Docker-orange?style=flat-square\&logo=render)

A modern, lightweight, enterprise-style core banking application inspired by digital banking platforms like YONO SBI. The system combines a powerful **Spring Boot backend**, a real-time **Apache POI Excel-based storage engine**, and a responsive **Tailwind CSS frontend**.

---

# 🌐 Live Demo

👉 **Frontend Dashboard:**
https://adithyapoojary271-web.github.io/javaproject/frontend/

---

# 🏗️ Project Architecture

The application is divided into two independent layers:

## Backend (`/backend`)

A Spring Boot REST API responsible for:

* Account creation and validation
* Deposit and withdrawal processing
* Excel file read/write operations
* Secure transaction handling
* Thread-safe banking operations

### Core Technologies

* Java 17
* Spring Boot 3.2
* Apache POI
* Maven

---

## Frontend (`/frontend`)

A clean, responsive single-page banking dashboard built using:

* HTML5
* Tailwind CSS
* Vanilla JavaScript

### Features

* Minimalist banking UI
* Mobile responsive layout
* Smooth animations
* Secure form validation
* Real-time API interaction

---

# 🛠️ Local Setup Guide

## Prerequisites

Install the following before running the project:

* Java JDK 17+
* Apache Maven
* Modern Browser (Chrome/Edge/Firefox/Safari)

---

# 🚀 Running the Backend

Open terminal inside the backend folder:

```bash
cd backend

# Build project
mvn clean package -DskipTests

# Start Spring Boot server
mvn spring-boot:run
```

Backend runs on:

```txt
http://localhost:8080
```

---

# 💻 Running the Frontend

The frontend is fully static.

Simply:

1. Open the `frontend/` folder
2. Double-click `index.html`

Or use VS Code Live Server for better development experience.

---

# 🐳 Docker Deployment

This project supports cloud deployment using Docker and Render.

## Dockerfile

```dockerfile
# Stage 1 - Build
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# Stage 2 - Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/excel-core-bank-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

# ☁️ Render Deployment Settings

| Setting        | Value   |
| -------------- | ------- |
| Environment    | Docker  |
| Root Directory | backend |
| Plan           | Free    |

---

# 🔐 Default Credentials

## Customer Login

```txt
Account Number: 12345
PIN: 1111
```

## Admin Access

```txt
Admin Key: admin
```

---

# 🛡️ Important Hosting Note

> Free hosting providers like Render use ephemeral file systems.
> This means `BankDatabase.xlsx` resets whenever the server restarts.

For permanent storage, migrate to:

* PostgreSQL
* MySQL
* MongoDB

---

# 📂 Project Structure

```txt
javaproject/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   └── BankDatabase.xlsx
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

# ✨ Key Features

* Excel-powered banking database
* Spring Boot REST API
* Deposit / Withdraw operations
* Account validation
* Docker container deployment
* Responsive banking dashboard
* Tailwind-based UI
* Lightweight architecture

---

# 📜 License

This project is intended for educational and portfolio demonstration purposes.

---

# 👨‍💻 Developer

Developed by **Adithya Poojary**

GitHub Repository:
https://github.com/adithyapoojary271-web/javaproject
