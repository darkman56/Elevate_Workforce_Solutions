# Elevate Workforce Solutions

Elevate Workforce Solutions is a job portal application that connects job seekers with companies. It allows companies to post job listings, job seekers to apply for jobs, and admins to manage users and jobs. The project is built with a React frontend, Node.js/Express backend, and MySQL database.

## Features
- **Admin Dashboard**: Manage companies, job seekers, and jobs (CRUD operations).
- **Company Dashboard**: Post, update, and delete job listings; view and download job applications.
- **Job Seeker**: Browse and apply for jobs with resume uploads.
- **Authentication**: Secure login for admins, companies, and job seekers using JWT.
- **File Uploads**: Job seekers can upload resumes (stored as LONGBLOB in MySQL).

## Tech Stack
- **Frontend**: React, Axios
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with `mysql2` package)
- **Authentication**: JWT, bcryptjs
- **File Handling**: Multer (for resume uploads)
- **Development Tools**: Nodemon, Vite (for React)

## Prerequisites
- Node.js (v22.11.0 or later)
- MySQL (v8.0 or later)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/darkman56/Elevate_Workforce_Solutions.git
cd Elevate_Workforce_Solutions
```
### 2. Set Up the Database
- **Install MySQL if not already installed.**
- **Create a database named job_portal_db: **
```bash
CREATE DATABASE job_portal_db;
```
- **Run the following SQL script to create the necessary tables (users, jobs, applications):**
```bash
USE job_portal_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'company', 'job_seeker') NOT NULL
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_id INT NOT NULL,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES users(id)
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_details VARCHAR(255) NOT NULL,
    file_data LONGBLOB,
    file_name VARCHAR(255),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);



-- Insert a default admin user (password: Admin123)
INSERT INTO users (full_name, email, password, role) VALUES 
('Admin User', 'admin@elevate.com', '$2a$10$yourHashedPasswordHere', 'admin');
```
- **Note**: Replace $2a$10$yourHashedPasswordHere with a hashed version of Admin123. You can generate the hash using a Node.js script:
```bash
const bcrypt = require('bcryptjs');
bcrypt.hash('Admin123', 10, (err, hash) => {
  console.log(hash);
});
Run this script in the server/ directory with node script.js and copy the hash into the SQL query.
```
### 3. Set Up the Backend
- **Navigate to the server/ directory:**
```bash
cd server
```
Install dependencies:
```bash
npm install
```
- **Update the database configuration in server/config/db.js with your MySQL credentials:**
```bash
const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your-mysql-password', // Replace with your MySQL password
  database: 'job_portal_db',
  port: 3307 // Adjust if your MySQL uses a different port
});
module.exports = pool;
```
- **Start the backend server:**
```bash
npm start
```
- **Note:** If npm start isn’t set up, add this to server/package.json:
```bash
"scripts": {
  "start": "nodemon server.js"
}

```
- **Alternatively, run:**
```bash
npx nodemon server.js
```
- **Expect:** The server should start on http://localhost:5000.
### 4. Set Up the Frontend
- **Navigate to the client/ directory:**
```bash
cd ../client
```
- **Install dependencies:**
```bash
npm install
```
- **Start the frontend development server:**
```bash
npm run dev
```
- **Expect:** The React app should start on http://localhost:5173.

## 5. Access the Application
- **Admin Login:** Go to http://localhost:5173/admin-login and log in with:
  - ***Email:*** admin@elevate.com
  - ***Password:*** Admin123
- **Company Login:** Register a company at http://localhost:5173/register (select "Company" role), then log in at http://localhost:5173/login.
- **Job Seeker:** Register a job seeker at http://localhost:5173/register (select "Job Seeker" role), then log in at http://localhost:5173/login.

## Project Structure
- **server/: Backend (Node.js/Express)**
  - **controllers/: Route handlers**
  - **routes/: API routes**
  - **config/: Database configuration**
  - **server.js: Entry point**
- **client/: Frontend (React)**
  - ***src/components/: React components (e.g., AdminDashboard.jsx)***
  - ***src/App.jsx: Main app component***
- **.gitignore: Ignores node_modules, build artifacts, etc.**

## Known Issues & Fixes
- **Nodemon Not Recognized:** If nodemon isn’t recognized, use npx nodemon server.js or add a start script to server/package.json (npm start). Alternatively, install nodemon globally:
```bash
npm install -g nodemon
```
- **Admin Login Failure:** If the admin password isn’t hashed in the database, hash it using a Node.js script and update the users table:
```bash
crypt = require('bcryptjs');
bcrypt.hash('Admin123', 10, (err, hash) => {
  console.log(hash);
});
```
  **Update the database via phpMyAdmin:**
```bash
UPDATE users SET password = 'hashed-password' WHERE email = 'admin@elevate.com';
```
- **Route Errors:** Resolved Route.post() requires a callback function errors by ensuring jobController and adminController imports and functions are correctly defined in jobRoutes.js and adminRoutes.js.

## Version Control
- **Added project to existing GitHub repository Elevate_Workforce_Solutions after staging and committing all files. Used git push --force (or merged with remote content using git pull --allow-unrelated-histories).**
- **Recreated .gitignore to exclude node_modules, build artifacts, and other unnecessary files.**
## Contributing
- **Fork the repository.**
- **Create a new branch (git checkout -b feature/your-feature).**
- **Commit your changes (git commit -m "Add your feature").**
- **Push to the branch (git push origin feature/your-feature).**
- **Open a Pull Request.**

## License
  **This project is licensed under the MIT License.**

## Contact Us
For support, feedback, or inquiries about Elevate Workforce Solutions, feel free to reach out:

  - **Email:** support@elevateworkforce.com
  - **GitHub Issues:** File an issue on our GitHub repository for bug reports or feature requests.
  - **Developer:** Prashant Khanal (prashantkhanal555@gmail.com)
