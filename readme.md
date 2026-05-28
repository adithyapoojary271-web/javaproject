# Excel Core Bank Management System

A high-performance web core-banking application built using a **Spring Boot REST API** coupled with an automated **Apache POI Excel Storage Engine File System** ledger backend and an intuitive single-page **Tailwind CSS UI Dashboard**.

## 🚀 Key Architectural Upgrades
- **Database Engine**: Uses physical `.xlsx` file system reading/writing operations dynamically upon business transactions.
- **REST API Middleware**: Decoupled framework executing explicit HTTP endpoints (`/login`, `/deposit`, `/withdraw`).
- **Graceful Shutdown Hooks**: Implements standard `@PreDestroy` container loops forcing runtime memory flushes back down into physical storage files gracefully.

## 🛠️ Step-by-Step Execution Guide

### Prerequisite Setup
Ensure you have installed:
1. **Java Development Kit (JDK 17 or higher)**
2. **Apache Maven**

### 1. Launch Backend Service
Navigate directly into the backend workspace directory and spin up the environment profile:
```bash
cd backend
mvn clean spring-boot:run