const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Job = {};

Job.getAll = (page, limit, callback) => {
  const offset = (page - 1) * limit;
  const query = 'SELECT * FROM jobs LIMIT ? OFFSET ?';
  db.query(query, [limit, offset], callback);
};

Job.getCount = (callback) => {
  db.query('SELECT COUNT(*) as total FROM jobs', callback);
};

Job.create = (title, description, companyId, callback) => {
  const query = 'INSERT INTO jobs (title, description, company_id) VALUES (?, ?, ?)';
  db.query(query, [title, description, companyId], callback);
};

Job.update = (id, title, description, companyId, callback) => {
  const query = 'UPDATE jobs SET title = ?, description = ? WHERE id = ? AND company_id = ?';
  db.query(query, [title, description, id, companyId], callback);
};

Job.delete = (id, companyId, callback) => {
  const query = 'DELETE FROM jobs WHERE id = ? AND company_id = ?';
  db.query(query, [id, companyId], callback);
};

Job.getByCompany = (companyId, callback) => {
  const query = 'SELECT * FROM jobs WHERE company_id = ?';
  db.query(query, [companyId], callback);
};

Job.getApplications = (jobId, callback) => {
  const query = 'SELECT id, full_name, address, contact_details, file_name, applied_date FROM applications WHERE job_id = ?';
  db.query(query, [jobId], callback);
};

Job.apply = (jobId, userId, fullName, address, contactDetails, fileData, fileName, callback) => {
  const query = 'INSERT INTO applications (job_id, user_id, full_name, address, contact_details, file_data, file_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [jobId, userId, fullName, address, contactDetails, fileData, fileName], callback);
};

module.exports = Job;