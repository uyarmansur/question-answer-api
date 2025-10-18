const bcrypt = require("bcryptjs");

const validateInputHelper = (email, password) => {
  return email && password;
};

const comparePasswords = (inputPassword, storedPassword) => {
  return bcrypt.compareSync(inputPassword, storedPassword);
};

module.exports = {
  validateInputHelper,
  comparePasswords,
};
