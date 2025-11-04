const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  console.log('Login request received:', req.body);
  const { employeeId, password } = req.body;

  // Input validation
  if (!employeeId || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  // Whitelist input using RegEx
  const employeeIdRegex = /^[a-zA-Z0-9]+$/;
  if (!employeeIdRegex.test(employeeId)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    // Check for existing employee
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const payload = {
      employee: {
        id: employee.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, employee });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
