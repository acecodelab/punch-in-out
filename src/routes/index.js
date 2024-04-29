// src/routes/index.js
const express = require('express');
const router = express.Router();
const { punchIn, punchOut, getPunchHistory, login, today, this_month, between_month,
    getUserList, updatePassword } = require('../controllers/punchController');
const { submitLeave, myLeaveRequests, approveLeave, rejectLeave, getRequests,
    cancelLeaveRequest, allLeaveRequeststoday, allLeaveRequeststhis_month,
    allLeaveRequestsbetween_month } = require('../controllers/leaveController');
const Middleware = require('../middleware/punchMiddleware');

//EMPLOYEE API PUNCH
// Punch In
router.post('/punch/in', Middleware.restrictAccessByIP, punchIn);
// Punch Out
router.post('/punch/out', Middleware.restrictAccessByIP, punchOut);
// Get Punches and Total Out Time for a User
router.get('/punches/:user_id', Middleware.restrictAccessByIP, getPunchHistory);
//LOGIN MIDDLEWARE 
router.post('/login', Middleware.restrictAccessByIP, login);
//Update Password
router.post('/updatePassword', updatePassword);


//ADMIN API PUNCH
// Today's reports
router.get('/reports/today', today);
// This month's reports
router.get('/reports/this-month', this_month);
// Reports between two dates
router.get('/reports/between-dates', between_month);
//User list
router.get('/users', getUserList);


//EMPLOYEE Leaves API 
// Leave routes USER 
router.post('/submitLeave', submitLeave);
router.get('/myLeaveRequests/:userId', myLeaveRequests);
router.get('/cancelLeaveRequest/:userId/:id', cancelLeaveRequest);
router.get('/myLeaveRequest/today', allLeaveRequeststoday);
// This month's reports
router.get('/myLeaveRequest/this-month', allLeaveRequeststhis_month);
// Reports between two dates
router.get('/myLeaveRequest/between-dates', allLeaveRequestsbetween_month);

//ADMIN Leaves API
router.get('/approveLeaveRequest/:id', approveLeave);
router.get('/rejectLeaveRequest/:id', rejectLeave);
router.get('/allLeaveRequests/:userId', myLeaveRequests);
// Today's reports
router.get('/allLeaveRequest/today', allLeaveRequeststoday);
// This month's reports
router.get('/allLeaveRequest/this-month', allLeaveRequeststhis_month);
// Reports between two dates
router.get('/allLeaveRequest/between-dates', allLeaveRequestsbetween_month);

module.exports = router;
