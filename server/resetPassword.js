const bcrypt = require('bcryptjs');

const newPassword = 'AdminPass123'; // Change this to your desired password
bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) console.error('Error generating hash:', err);
  else console.log('New Hash:', hash);
});