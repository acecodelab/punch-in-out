// src/controllers/punchController.js
const Leave = require('../models/leave.js');
const nodemailer = require('nodemailer');

const submitLeave = async (req, res) => {
    const { leaveType, leaveStartDate, reason, userId } = req.body;
    var userDetail = await Leave.getUserDetails(userId)
    const data = await Leave.leaveRequest(leaveType, leaveStartDate, reason, userId);
    if (data) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // TLS port
            secure: false,//true for port  465 , false for others
            auth: {
                user: 'infonxtgenvirtue@gmail.com', // Your Gmail address
                pass: 'pwuh rpja vilo zkkb' // Your Gmail password or App Password if 2-Step Verification is enabled
            }
        });

        let htmlContent = `
                        <html>
                        <head>
                            <style>
                                table {
                                    font-family: Arial, sans-serif;
                                    border-collapse: collapse;
                                    width: 100%;
                                }
                                th, td {
                                    border: 1px solid #dddddd;
                                    text-align: left;
                                    padding: 8px;
                                }
                                tr:nth-child(even) {
                                    background-color: #f2f2f2;
                                }
                            </style>
                        </head>
                        <body>

                        <table>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Leave Type</th>
                        </tr>
                        <tr>
                            <td>${userDetail.name}</td>
                            <td>${leaveStartDate}</td>
                            <td>${leaveType}</td>
                        </tr>
                        </table>
                        <h2>Reason:</h2>
                        <p>${reason}</p>
                        </body>
                        </html>
                        `;

        const mailOptions = {
            from: "infonxtgenvirtue@gmail.com",
            to: 'rajat.thakur@nxtgenvirtue.com', // User's email address
            //bcc: 'piyush@nxtgenvirtue.com',
            subject: leaveType + ' Requested by ' + userDetail.name,
            text: "Hello Sir, I " + userDetail.name + ' request a ' + leaveType + ' for ' + leaveStartDate + ' and reason for leave : -' + reason,
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.json({ "status": true });
    }
    else {
        res.status(500).json({ "status": flase, error: 'Internal server error' });
    }
};

const myLeaveRequests = async (req, res) => {
    const { userId } = req.params;
    const data = await Leave.myLeaveRequests(userId);
    const dataCount = await Leave.countStatusWise(userId);
    if (data.length > 0) {
        res.json({ "data": data, dataCount: dataCount });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], dataCount: [] });
    }
};

const cancelLeaveRequest = async (req, res) => {
    const { userId, id } = req.params;
    const data = await Leave.cancelLeaveRequest(userId, id);
    if (data) {
        res.json({ "status": true });
    }
    else {
        res.status(500).json({ "status": false, error: 'Internal server error' });
    }
}

const approveLeave = async (req, res) => {
    const { id } = req.params;
    const data = await Leave.approveLeaveRequest(id);
    if (data) {
        res.json({ "status": true });
    }
    else {
        res.status(500).json({ "status": false, error: 'Internal server error' });
    }
};

const rejectLeave = async (req, res) => {
    const { id } = req.params;
    const data = await Leave.rejectLeaveRequest(id);
    if (data) {
        res.json({ "status": true });
    }
    else {
        res.status(500).json({ "status": false, error: 'Internal server error' });
    }
};

const allLeaveRequeststoday = async (req, res) => {
    const { userId } = req.query;
    const data = await Leave.today(userId);
    const dataCount = await Leave.countStatusWiseToday(userId);
    if (data.length > 0) {
        res.json({ "data": data, dataCount: dataCount });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], dataCount: [] });
    }
}

const allLeaveRequeststhis_month = async (req, res) => {
    const { userId } = req.query;
    const data = await Leave.this_month(userId)
    const dataCount = await Leave.countStatusWiseThisMonth(userId);
    if (data.length > 0) {
        res.json({ "data": data, dataCount: dataCount });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], dataCount: [] });
    }
}

const allLeaveRequestsbetween_month = async (req, res) => {
    const { startDate, endDate, userId } = req.query;
    const data = await Leave.between_month(startDate, endDate, userId);
    const dataCount = await Leave.countStatusWiseBetweenMonth(startDate, endDate, userId);
    if (data.length > 0) {
        res.json({ "data": data, dataCount: dataCount });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], dataCount: [] });
    }

}

const getRequests = async (req, res) => {

}

module.exports = {
    submitLeave, myLeaveRequests, approveLeave, rejectLeave, getRequests,
    cancelLeaveRequest, allLeaveRequeststoday, allLeaveRequeststhis_month, allLeaveRequestsbetween_month
};
