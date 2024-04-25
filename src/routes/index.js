// src/routes/index.js
const express = require('express');
const router = express.Router();
const { punchIn, punchOut, getPunchHistory, login, today, this_month, between_month, getUserList } = require('../controllers/punchController');

// Punch In
router.post('/punch/in', punchIn);

// Punch Out
router.post('/punch/out', punchOut);

// Get Punches and Total Out Time for a User
router.get('/punches/:user_id', getPunchHistory);

router.post('/login', login);

// Today's reports
router.get('/reports/today', today);

// This month's reports
router.get('/reports/this-month', this_month);

// Reports between two dates

router.get('/reports/between-dates', between_month);

router.get('/users', getUserList);


module.exports = router;
