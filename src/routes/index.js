// src/routes/index.js
const express = require('express');
//const puppeteer = require('puppeteer');

const router = express.Router();
const { punchIn, punchOut, getPunchHistory, getNotifications, login, today, this_month, between_month,
    getUserList, updatePassword,addNotification, loginAdmin, todaysDetail, todaysDetailMore, todaysLeaveDetail, fetchLeaveDetails, fetchAbsentDetails } = require('../controllers/punchController');
const { submitLeave, submitAbsent, myLeaveRequests, allAbsent, approveLeave, rejectLeave, leaveCount,
    cancelLeaveRequest, allLeaveRequeststoday, allLeaveRequeststhis_month,
    allLeaveRequestsbetween_month, allAbsentToday, allAbsentthis_month, allAbsentbetween_month } = require('../controllers/leaveController');
const { submitTask, getTask, closeTask, taskToday, taskThisMonth, taskBetweenDates, getCurrentTask } = require('../controllers/taskController');
const { new_user, get_user_list, sendPassword, changeStatus, getUserDetails, update_details } = require('../controllers/userController');
const Middleware = require('../middleware/punchMiddleware');

//EMPLOYEE API PUNCH
// Punch In
router.post('/punch/in', Middleware.restrictAccessByIP, punchIn);
// Punch Out
router.post('/punch/out', Middleware.restrictAccessByIP, punchOut);
// Get Punches and Total Out Time for a User
router.get('/punches/:user_id', Middleware.restrictAccessByIP, getPunchHistory);
router.get('/notifications', Middleware.restrictAccessByIP, getNotifications);
//LOGIN MIDDLEWARE 
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);
//Update Password
router.post('/updatePassword', updatePassword);
router.post('/add-notification', addNotification);


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
router.post('/submitAbsent', submitAbsent);
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
router.get('/allAbsent/:userId', allAbsent);
// Today's reports
router.get('/allLeaveRequest/today', allLeaveRequeststoday);
// This month's reports
router.get('/allLeaveRequest/this-month', allLeaveRequeststhis_month);
// Reports between two dates
router.get('/allLeaveRequest/between-dates', allLeaveRequestsbetween_month);

router.get('/allAbsents/today', allAbsentToday);
// This month's reports
router.get('/allAbsents/this-month', allAbsentthis_month);
// Reports between two dates
router.get('/allAbsents/between-dates', allAbsentbetween_month);

router.get('/fetchLeaveDetails', fetchLeaveDetails)
router.get('/fetchAbsentDetails', fetchAbsentDetails)


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


router.post('/new_user', new_user);
router.get('/get_user_list', get_user_list);
router.post('/sendPassword', sendPassword);
router.post('/changeStatus', changeStatus);
router.get('/get_current_task', getCurrentTask);
router.get('/getUserDetails/:id', getUserDetails);
router.post('/update_details', update_details);

module.exports = router;
