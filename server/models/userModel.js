const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {};

User.create = (fullName, email, password, role, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);
    const query = 'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [fullName, email, hashedPassword, role], callback);
  });
};

User.findByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = User;