const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminController = {};

adminController.addCompany = (req, res) => {
  const { fullName, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      const insertQuery = 'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [fullName, email, hash, 'company'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Company added successfully' });
      });
    });
  });
};

adminController.updateCompany = (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Company not found' });
    if (results[0].role !== 'company') return res.status(403).json({ message: 'Not a company account' });
    const updateQuery = 'UPDATE users SET full_name = ?, email = ?' + (password ? ', password = ?' : '') + ' WHERE id = ?';
    const values = [fullName, email];
    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });
        values.push(hash);
        db.query(updateQuery, [...values, id], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ message: 'Company updated successfully' });
        });
      });
    } else {
      db.query(updateQuery, [...values, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Company updated successfully' });
      });
    }
  });
};

adminController.deleteCompany = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Company not found' });
    if (results[0].role !== 'company') return res.status(403).json({ message: 'Not a company account' });
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Company deleted successfully' });
    });
  });
};

adminController.getCompanies = (req, res) => {
  const query = 'SELECT id, full_name, email FROM users WHERE role = ?';
  db.query(query, ['company'], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

adminController.addJobSeeker = (req, res) => {
  const { fullName, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });
      const insertQuery = 'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [fullName, email, hash, 'job_seeker'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Job seeker added successfully' });
      });
    });
  });
};

adminController.updateJobSeeker = (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Job seeker not found' });
    if (results[0].role !== 'job_seeker') return res.status(403).json({ message: 'Not a job seeker account' });
    const updateQuery = 'UPDATE users SET full_name = ?, email = ?' + (password ? ', password = ?' : '') + ' WHERE id = ?';
    const values = [fullName, email];
    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });
        values.push(hash);
        db.query(updateQuery, [...values, id], (err, result) => {
          if (err) return res.status(500).json({ message: 'Database error' });
          res.json({ message: 'Job seeker updated successfully' });
        });
      });
    } else {
      db.query(updateQuery, [...values, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Job seeker updated successfully' });
      });
    }
  });
};

adminController.deleteJobSeeker = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Job seeker not found' });
    if (results[0].role !== 'job_seeker') return res.status(403).json({ message: 'Not a job seeker account' });
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Job seeker deleted successfully' });
    });
  });
};

adminController.getJobSeekers = (req, res) => {
  const query = 'SELECT id, full_name, email FROM users WHERE role = ?';
  db.query(query, ['job_seeker'], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

module.exports = adminController;