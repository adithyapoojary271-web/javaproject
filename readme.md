# Excel Core Bank Management System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Java Version](https://img.shields.io/badge/Java-17%2B-blue?style=flat-square&logo=java)
![Framework](https://img.shields.io/badge/Framework-Spring%20Boot%203.2-spring?style=flat-square&logo=springboot)
![Database Engine](https://img.shields.io/badge/Database-Apache%20POI%20Excel-green?style=flat-square&logo=microsoft-excel)
![Deployment](https://img.shields.io/badge/Deployment-Render%20%2B%20Docker-orange?style=flat-square&logo=render)

A clean, minimalist, high-performance web core-banking application mimicking enterprise digital banking infrastructures like YONO SBI. The application pairs a robust **Spring Boot REST API** with a real-time, file-based **Apache POI Excel Storage Engine** and a task-focused frontend built with **Tailwind CSS**.

---

## 🌐 Live Web Deployment
The user interface is hosted publicly and can be accessed at:
👉 **[Excel Core Bank Dashboard](https://adithyapoojary271-web.github.io/javaproject/frontend/)**

---

## 🏗️ System Architecture

The application splits computational workloads into two highly decoupled tiers:

1. **Backend Engine (`/backend`)**: A Spring Boot service managing runtime thread safety, handling explicit REST endpoints, and performing read/write filesystem operations natively on an active Excel workbook ledger (`BankDatabase.xlsx`).
2. **Client Dashboard (`/frontend`)**: A modular, state-driven single-page interface focusing on high-contrast text menus, data-payload field sanitization, and explicit session-reversal paths.

---

## 🛠️ Local Environment Setup

### Prerequisites
Ensure your local development machine has the following dependencies configured:
- **Java Development Kit (JDK 17 or higher)**
- **Apache Maven** (Optional if using the provided wrapper script)
- **Modern Web Browser** (Chrome, Edge, Safari, or Firefox)

### 1. Launching the Backend REST API
Navigate into your system's source workspace directory and invoke the compilation sequence:

```bash
cd backend
# Build the artifact binaries while bypassing unit testing profiles
mvn clean package -DskipTests

# Initialize the Spring Boot runtime application
mvn spring-boot:run
```
# Stage 2: Minimalist execution engine configuration
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/excel-core-bank-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
🔐 Pre-Seeded System CredentialsFor rapid verification of functional pipelines after initialization, utilize the default master records:Seeded Customer Profile: Account Number: 12345 | Security PIN: 1111Administrative Access Key: Verification Passphrase Token: admin🛡️ Ephemeral File System NoticeOperational Note: Free-tier container hosting environments (like Render) employ ephemeral filesystems. Every time the cloud instance restarts or spins down due to inactivity, the BankDatabase.xlsx file will automatically revert back to its initial seeded state. For permanent long-term data storage, connect the Spring Service to an external relational cloud instance (e.g., PostgreSQL).
# Initialize the Spring Boot runtime application
mvn spring-boot:run
