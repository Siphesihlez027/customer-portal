const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// @route   POST api/employee/auth/login
// @desc    Authenticate employee & get token
// @access  Public
router.post('/login', login);

module.exports = router;
