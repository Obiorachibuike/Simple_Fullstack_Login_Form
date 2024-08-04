const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// Signup route
router.post('/signup',);

// Login route
router.post('/login',);

module.exports = router;
