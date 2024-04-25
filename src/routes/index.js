// src/routes/index.js
const express = require('express');
const router = express.Router();
const { punchIn, punchOut, getPunchHistory, login, today, this_month, between_month, getUserList } = require('../controllers/punchController');
const Middleware = require('../middleware/punchMiddleware');

// Punch In
router.post('/punch/in', Middleware.restrictAccessByIP, punchIn);

// Punch Out
router.post('/punch/out', Middleware.restrictAccessByIP, punchOut);

// Get Punches and Total Out Time for a User
router.get('/punches/:user_id', Middleware.restrictAccessByIP, getPunchHistory);

router.post('/login', Middleware.restrictAccessByIP, login);

// Today's reports
router.get('/reports/today', today);

// This month's reports
router.get('/reports/this-month', this_month);

// Reports between two dates

router.get('/reports/between-dates', between_month);

router.get('/users', getUserList);


module.exports = router;
