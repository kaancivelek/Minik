# 🏡 Tiny House Reservation and Management System

A full-stack reservation and management system for Tiny House rentals with role-based access, developed using React, ASP.NET Core, and MSSQL. This project is currently in MVP (Minimum Viable Product) stage.

## 📅 Project Date

March 13, 2025

## 👨‍💻 Development Team

- **Kaan Civelek** - Full-Stack & Project Lead
- **Naciye Kaya** - Backend Controllers And Models
- **Nebi Çiftkaldıran** - Backend Controllers And Models 
- **Raif Mert İkier** - Database Structure And Model && Admin Panel

## 🧾 Project Description

This system allows **tenants** to search and reserve Tiny Houses, **hosts** to manage listings and bookings, and **administrators** to moderate and supervise the platform's overall activity. It includes functionality for payments, reviews, user management, and statistical reporting. The project emphasizes database-driven development with real-world software engineering practices.

## 🔧 Tech Stack

### Backend
- **Framework:** ASP.NET Core Web API
- **Database Access:** ADO.NET
- **Database:** Microsoft SQL Server (MSSQL)

### Frontend
- **Framework:** React.js
- **Libraries:** Reactstrap, React Router DOM, Ant Design, Axios, Reactstrap, Toastify

## 🚀 Features by User Role

### 🏠 Tenant
- Register/login
- Browse and filter Tiny Houses
- Make/cancel bookings
- Make online payments
- Submit reviews and ratings

### 👨‍🌾 Host
- Create, edit, and manage listings
- Accept/reject reservation requests
- View booking history and tenant reviews
- Track payments and income

### 🛠️ Admin
- Manage user accounts
- Cancel bookings
- Moderate listings
- Monitor transactions
- View system statistics and reports

## 📁 Database Features

- Stored Procedures (e.g., reservation creation)
- Functions (e.g., booking cost calculation)
- Triggers (e.g., log reservation status changes)
- Full ER Diagram with normalized schema
- Constraints (Primary, Foreign, Unique, Not Null, Check)

## 🖥️ Installation & Running the Project

### Prerequisites
- Visual Studio 2022 or later
- Node.js (LTS version)
- SQL Server 2019 or later
- SQL Server Management Studio (SSMS)

### 🔐 Database Setup

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your local SQL Server instance:
   - Server Name: `localhost`
   - Authentication: Windows Authentication
3. Execute the `db.sql` script located in the root folder

### ⚙️ Backend Setup (ASP.NET Core API)

1. Navigate to the `backend` folder
2. Open the `.sln` file using Visual Studio
3. Configure launch properties for launching multiple starting projects
4. Press `F5` to start the server
5. To stop the server, close the console window

### 🎨 Frontend Setup (React)

1. Navigate to the `frontend` folder
2. Open terminal and run:
   ```bash
   npm install
   npm run dev
   ```
3. The application will open in your default browser at `http://localhost:5173`

### 🚀 Quick Start

You can use the provided `start-project.bat` script to start both frontend and backend services simultaneously.

## 📝 License

This project is licensed under the terms included in the LICENSE file.

## 🤝 Contributing

This is a university course project developed by students of the Hasan Ferdi Turgutlu Technology Faculty, Software Engineering Department. For any questions or contributions, please contact the project lead.
