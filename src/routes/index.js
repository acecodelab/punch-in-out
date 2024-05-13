// src/routes/index.js
const express = require('express');
//const puppeteer = require('puppeteer');

const router = express.Router();
const { punchIn, punchOut, getPunchHistory, login, today, this_month, between_month,
    getUserList, updatePassword, loginAdmin, todaysDetail, todaysDetailMore, todaysLeaveDetail, fetchLeaveDetails } = require('../controllers/punchController');
const { submitLeave, myLeaveRequests, approveLeave, rejectLeave, leaveCount,
    cancelLeaveRequest, allLeaveRequeststoday, allLeaveRequeststhis_month,
    allLeaveRequestsbetween_month } = require('../controllers/leaveController');
const { submitTask, getTask, closeTask, taskToday, taskThisMonth, taskBetweenDates } = require('../controllers/taskController');
const Middleware = require('../middleware/punchMiddleware');

//EMPLOYEE API PUNCH
// Punch In
router.post('/punch/in', Middleware.restrictAccessByIP, punchIn);
// Punch Out
router.post('/punch/out', Middleware.restrictAccessByIP, punchOut);
// Get Punches and Total Out Time for a User
router.get('/punches/:user_id', Middleware.restrictAccessByIP, getPunchHistory);
//LOGIN MIDDLEWARE 
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);
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

router.get('/todaysDetail', todaysDetail);
router.get('/todaysDetailMore', todaysDetailMore);
router.get('/todaysLeaveDetail', todaysLeaveDetail)



//EMPLOYEE Leaves API 
// Leave routes USER 
router.post('/submitLeave', submitLeave);
router.get('/myLeaveRequests/:userId', myLeaveRequests);
router.get('/cancelLeaveRequest/:userId/:id', cancelLeaveRequest);
router.get('/myLeaveRequest/today', allLeaveRequeststoday);
router.get('/leaveCount/:userId', leaveCount);
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

router.get('/fetchLeaveDetails', fetchLeaveDetails)


//Employee Task Api
router.post('/tasks', submitTask);
router.get('/tasks/:userId/:status', getTask);
router.put('/tasks/:id', closeTask);

// Today's reports
router.get('/tasks/today', taskToday);
// This month's reports
router.get('/tasks/this-month', taskThisMonth);
// Reports between two dates
router.get('/tasks/between-dates', taskBetweenDates);

module.exports = router;
