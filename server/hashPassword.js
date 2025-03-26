const bcrypt = require('bcryptjs');

const password = 'CompanyPass123'; // Change this per company
bcrypt.hash(password, 10, (err, hash) => {
  if (err) console.error(err);
  console.log(hash);
});