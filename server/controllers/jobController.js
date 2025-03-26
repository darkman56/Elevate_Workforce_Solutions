const Job = require('../models/jobModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const db = require('../config/db');

// Set up multer to store in memory (not filesystem)
const upload = multer({ storage: multer.memoryStorage() });

const jobController = {};

jobController.getJobs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Updated query to join jobs with users for company name
  const query = `
    SELECT j.*, u.full_name AS company_name 
    FROM jobs j 
    JOIN users u ON j.company_id = u.id 
    LIMIT ? OFFSET ?
  `;
  db.query(query, [limit, offset], (err, jobs) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    Job.getCount((err, countResult) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      const total = countResult[0].total;
      res.json({
        jobs,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    });
  });
};

// Middleware to verify JWT and check role
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    if (decoded.role !== 'company' && decoded.role !== 'job_seeker' && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    req.user = decoded;
    next();
  });
};

jobController.createJob = (req, res) => {
  const { title, description } = req.body;
  const companyId = req.user.id;
  if (!title || !description) return res.status(400).json({ message: 'All fields required' });
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can create jobs' });
  
  Job.create(title, description, companyId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Job created', jobId: result.insertId });
  });
};

jobController.updateJob = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const companyId = req.user.id;
  if (!title || !description) return res.status(400).json({ message: 'All fields required' });
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can update jobs' });
  
  Job.update(id, title, description, companyId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Job not found or not yours' });
    res.json({ message: 'Job updated' });
  });
};

jobController.deleteJob = (req, res) => {
  const { id } = req.params;
  const companyId = req.user.id;
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can delete jobs' });
  
  Job.delete(id, companyId, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Job not found or not yours' });
    res.json({ message: 'Job deleted' });
  });
};

jobController.getCompanyDashboard = (req, res) => {
  const companyId = req.user.id;
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can view dashboard' });
  
  Job.getByCompany(companyId, (err, jobs) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    const dashboardData = { jobs: [] };
    let pending = jobs.length;
    
    if (pending === 0) return res.json(dashboardData);
    
    jobs.forEach((job, index) => {
      Job.getApplications(job.id, (err, applications) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        dashboardData.jobs[index] = { ...job, applications };
        pending--;
        if (pending === 0) res.json(dashboardData);
      });
    });
  });
};

jobController.applyJob = (req, res) => {
  const { jobId, fullName, address, contactDetails } = req.body;
  const userId = req.user.id;
  const fileData = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;
  if (!jobId || !fullName || !address || !contactDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (req.user.role !== 'job_seeker') return res.status(403).json({ message: 'Only job seekers can apply' });

  Job.apply(jobId, userId, fullName, address, contactDetails, fileData, fileName, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Application submitted' });
  });
};

jobController.downloadFile = (req, res) => {
  const { id } = req.params;
  const companyId = req.user.id;
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Only companies can download files' });

  const query = 'SELECT a.file_data, a.file_name, j.company_id FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Application not found' });
    const { file_data, file_name, company_id } = results[0];
    if (company_id !== companyId) return res.status(403).json({ message: 'Not authorized to access this file' });

    if (!file_data) return res.status(404).json({ message: 'No file uploaded' });
    res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(file_data);
  });
};

// Admin-specific job management
jobController.getAllJobs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT j.*, u.full_name AS company_name 
    FROM jobs j 
    JOIN users u ON j.company_id = u.id 
    LIMIT ? OFFSET ?
  `;
  db.query(query, [limit, offset], (err, jobs) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    Job.getCount((err, countResult) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      const total = countResult[0].total;
      res.json({
        jobs,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    });
  });
};

jobController.createAdminJob = (req, res) => {
  const { title, description, companyId } = req.body;
  if (!title || !description || !companyId) return res.status(400).json({ message: 'All fields required' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can create jobs' });

  const query = 'INSERT INTO jobs (title, description, company_id) VALUES (?, ?, ?)';
  db.query(query, [title, description, companyId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Job created by admin', jobId: result.insertId });
  });
};

jobController.updateAdminJob = (req, res) => {
  const { id } = req.params;
  const { title, description, companyId } = req.body;
  if (!title || !description || !companyId) return res.status(400).json({ message: 'All fields required' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can update jobs' });

  const query = 'UPDATE jobs SET title = ?, description = ?, company_id = ? WHERE id = ?';
  db.query(query, [title, description, companyId, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job updated by admin' });
  });
};

jobController.deleteAdminJob = (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can delete jobs' });

  const query = 'DELETE FROM jobs WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted by admin' });
  });
};

module.exports = { jobController, authMiddleware, upload };