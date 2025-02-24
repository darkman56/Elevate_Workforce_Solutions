# Elevate Job Portal Application

Welcome to the Elevate Job Portal Application, a web-based platform designed for Elevate Workforce Solutions to connect job seekers, employers, and administrators in Nepal. This portal streamlines job postings, applications, and management, ensuring a secure, scalable, and user-friendly experience.

## Overview

The Elevate Job Portal addresses the lack of a centralized digital hub for employment processes, offering:
- Role-based access for job seekers, employers, and admins.
- Secure authentication with JSON Web Tokens (JWT) and bcrypt.
- Job listing, application, and management features using Node.js, Express.js, React, and MySQL.
- File uploads (resumes) stored as `LONGBLOB` in MySQL via Multer.
- An intuitive interface with a blue (#1877F2) and orange (#f28c38) color scheme.

## Features

- **Job Seekers**: Register, log in, search jobs (10 per page), and apply with resumes.
- **Employers**: Log in, post/edit/delete jobs, and review applications with file downloads.
- **Administrators**: Manage company accounts, ensure security, and oversee operations.
- **Security**: Role-based access, encrypted passwords, HTTPS-ready JWT sessions.
- **Scalability**: MySQL database designed for growth, MVC architecture for future enhancements.

## Prerequisites

Before setting up, ensure you have the following installed:
- **Node.js** (v16 or later)
- **MySQL Server** (v8.0 or later)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Elevate_Workforce_Solutions.git
cd Elevate_Workforce_Solutions
```
2. Set Up the Database
Install MySQL and create a database named job_portal_db.
Update server/config/db.js with your MySQL credentials:
```bash
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your-mysql-password', // Replace with your password
  database: 'job_portal_db',
  port: 3307 // Adjust if your MySQL uses a different port
});

```

Run the SQL script to create tables (users, jobs, applications). Use this in MySQL Workbench or CLI:
```bash
CREATE DATABASE job_portal_db;

USE job_portal_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('job_seeker', 'company', 'admin') NOT NULL
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  company_id INT NOT NULL,
  posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES users(id)
);

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact_details VARCHAR(100) NOT NULL,
  file_data LONGBLOB,
  file_name VARCHAR(255),
  applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```
3. Install Dependencies
Navigate to the server/ directory:
```bash
cd server
npm install
```
4. Configure Environment
Ensure server/config/db.js uses your MySQL credentials.
Update server/index.js if needed for port or CORS (defaults to port 5000).
Running the Application
1. Start the Backend
In the server/ directory:
```bash
nodemon server.js
```
Ensure MySQL is running locally (e.g., mysql -u root -p).

2. Start the Frontend
In the client/ directory:
```bash
npm run dev
```
Open your browser to http://localhost:5173 to access the portal.

3. Usage

Job Seekers: Visit /, use the "Login/Signup" popup to register (/jobseeker-register) or log in (/jobseeker-login), then browse jobs (/jobs) and apply with resumes.
Employers: Log in via the popup (/company-login), manage jobs on /dashboard, and download applicant resumes.
Administrators: Access /admin-login (manually enter URL), log in, and manage companies on /admin-dashboard.

4.Technologies Used

Backend: Node.js, Express.js, MySQL, Multer, JWT, bcrypt
Frontend: React, Vite, Axios, CSS
Development Tools: VS Code, Postman, Git/GitHub, Trello, MySQL Workbench
Methodology: Agile (6 two-week sprints)
Contributing
Fork the repository, create a branch, and submit pull requests.
Report issues or suggest features via GitHub Issues.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For questions or support, contact Prashant Khanal at prashantkhanal555@gmail.com.
