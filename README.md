# 🧾 Express + PostgreSQL CRUD REST API

This project is a **RESTful API** built using **Node.js (Express.js)** and **PostgreSQL**.  
It allows you to perform **CRUD (Create, Read, Update, Delete)** operations on records, secured by basic authentication and documented using **Swagger UI**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
  - [1️⃣ Prerequisites](#1️⃣-prerequisites)
  - [2️⃣ Clone the Repository](#2️⃣-clone-the-repository)
  - [3️⃣ Install Dependencies](#3️⃣-install-dependencies)
  - [4️⃣ Configure Database](#4️⃣-configure-database)
  - [5️⃣ Create Database Tables](#5️⃣-create-database-tables)
  - [6️⃣ Start the Server](#6️⃣-start-the-server)
- [API Endpoints](#-api-endpoints)
- [Swagger Documentation](#-swagger-documentation)
- [Testing with Postman](#-testing-with-postman)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🚀 Features

✅ Built using **Express.js**  
✅ Integrated with **PostgreSQL** via `pg`  
✅ CRUD operations on “records” table  
✅ **Authentication middleware** for API access  
✅ **Swagger UI** documentation  
✅ Proper **error handling** and **clean structure**  
✅ Ready to deploy to Render / Heroku

---

## 💻 Tech Stack

| Component | Technology |
|------------|-------------|
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Documentation | Swagger UI (OpenAPI 3.0) |
| Auth | Basic Token Authentication |
| Language | JavaScript (ES6) |
| API Testing | Postman or Swagger |

---

## 📂 Project Structure

│
├── bin/
│ └── www # Server start file
│
├── routes/
│ └── record.js # CRUD routes
│
├── middleware/
│ └── auth.js # Authentication middleware
│
├── dbconfig.js # PostgreSQL connection
├── swagger.js # Swagger setup
├── app.js # Express app initialization
├── package.json # Dependencies
└── README.md # Documentation


---


---

## ⚙️ Setup Guide

### 1️⃣ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v16+)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (v13+)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/express-crud-api.git
cd express-crud-api


3️⃣ Install Dependencies
npm install


4️⃣ Configure Database

Create a file named dbconfig.js:

// dbconfig.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // your DB username
  host: 'localhost',
  database: 'recordsdb',   // your DB name
  password: 'yourpassword',
  port: 5432,
});

module.exports = pool;


5️⃣ Create Database Tables

Run the following SQL commands in PostgreSQL:

CREATE DATABASE recordsdb;

\c recordsdb;

CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at timestamp without time zone
);


6️⃣ Start the Server
npm start


Visit the server at:

http://localhost:3000


🌐 API Endpoints
Method	Endpoint	Description	Example Usage
POST	/api/addRecord	Add new record	/api/addRecord?name=John&status=active
POST	/api/getRecords	Get all or filter by status	/api/getRecords?status=active
PUT	/api/updateRecord	Update record	/api/updateRecord?id=1&name=Jane&status=inactive
DELETE	/api/deleteRecord	Delete record by ID	/api/deleteRecord?id=1


