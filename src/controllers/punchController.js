// src/controllers/punchController.js
const Punch = require('../models/punch.js');
const nodemailer = require('nodemailer');
const punchIn = async (req, res) => {
    const { user_id, email, overTimeReason } = req.body;
    try {
        var type = null;
        if (isSevenPMOrLater()) {
            type = 'Overtime'
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587, // TLS port
                secure: false,//true for port  465 , false for others
                auth: {
                    user: 'infonxtgenvirtue@gmail.com', // Your Gmail address
                    pass: 'pwuh rpja vilo zkkb' // Your Gmail password or App Password if 2-Step Verification is enabled
                }
            });

            const mailOptions = {
                from: 'infonxtgenvirtue@gmail.com',
                to: 'rajat.thakur@nxtgenvirtue.com', // User's email address
                bcc: 'piyush@nxtgenvirtue.com',
                subject: 'Overtime by ' + email,
                text: 'Overtime by' + email
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
        else {
            type = 'Normal'
        }
        console.log(type)
        const punchCount = await Punch.count_punch_in(user_id)
        if (punchCount >= 9) {
            // Create a transporter using Gmail SMTP
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587, // TLS port
                secure: false,//true for port  465 , false for others
                auth: {
                    user: 'infonxtgenvirtue@gmail.com', // Your Gmail address
                    pass: 'pwuh rpja vilo zkkb' // Your Gmail password or App Password if 2-Step Verification is enabled
                }
            });

            const mailOptions = {
                from: 'rajat.thakur.1903@gmail.com',
                to: email, // User's email address
                bcc: 'piyush@nxtgenvirtue.com',
                subject: 'Exceeded Punch In Limit',
                text: email + ' have exceeded the maximum allowed punch in limit for today.'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });

            const punch = await Punch.create({ user_id, punch_type: 'in', type, overTimeReason });
            res.json({ success: true, error: 'Exceeded maximum punch in limit for today.Your details are forward to Officials', data: punch });
        } else {

            const punch = await Punch.create({ user_id, punch_type: 'in', type, overTimeReason });
            res.json({ success: true, data: punch, error: null });
        }
    } catch (error) {
        console.error('Error punching in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const punchOut = async (req, res) => {
    const { user_id, overTimeReason } = req.body;
    try {
        var type = null;
        if (isSevenPMOrLater()) {
            type = 'Overtime'
        }
        else {
            type = 'Normal'
        }
        const punch = await Punch.create({ user_id, punch_type: 'out', type, overTimeReason });
        res.json({ success: true, data: punch });
    } catch (error) {
        console.error('Error punching out:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getPunchHistory = async (req, res) => {
    const { user_id } = req.params;
    try {
        const punches = await Punch.getByUserId(user_id);
        const totalOutTime = calculateTotalOutTime(punches);
        const punchesMonth = await Punch.getByUserIdForMonth(user_id)
        const totalOutTimeMonth = calculateTotalOutTime(punchesMonth);
        res.json({ success: true, data: { punches, totalOutTime, punchesMonth, totalOutTimeMonth } });
    } catch (error) {
        console.error('Error fetching punches:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const calculateTotalOutTime = (punches) => {
    let totalOutTime = 0;
    let lastPunch = null;

    punches.forEach(punch => {
        if (punch.punch_type === 'out' && lastPunch && lastPunch.punch_type === 'in') {
            const punchTime = new Date(punch.timestamp).getTime();
            const lastPunchTime = new Date(lastPunch.timestamp).getTime();
            totalOutTime += punchTime - lastPunchTime;
        }
        lastPunch = punch;
    });

    return totalOutTime;
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Punch.loginUser(username, password)
        if (user) {
            // Successful login
            res.json({ success: true, user_id: user.id, name: user.name, username: user.username, email: user.email });
        } else {
            // Invalid credentials
            res.status(401).json({ success: false, error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Punch.loginAdmin(username, password, 'admin')
        if (user) {
            // Successful login
            res.json({ success: true, user_id: user.id, name: user.name, username: user.username, email: user.email });
        } else {
            // Invalid credentials
            res.status(401).json({ success: false, error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const today = async (req, res) => {
    const { userId } = req.query;
    const data = await Punch.today(userId)
    if (data) {
        res.json({ "reports": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const this_month = async (req, res) => {
    const { userId } = req.query;
    const data = await Punch.this_month(userId)
    if (data) {
        res.json({ "reports": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const between_month = async (req, res) => {
    const { startDate, endDate, userId } = req.query;
    const data = await Punch.between_month(startDate, endDate, userId);
    if (data) {
        res.json({ "reports": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }

}

const getUserList = async (req, res) => {
    const data = await Punch.getUserList();
    if (data) {
        res.json({ "users": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }

}

const updatePassword = async (req, res) => {
    const { c_password, n_password, userId } = req.body
    const data = await Punch.updatePassword(c_password, n_password, userId);
    if (data) {
        res.json({ status: true });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const punchOutNow = async () => {
    await Punch.punchOutNow()
    return true;
}

function isSevenPMOrLater() {
    var today = new Date().getHours();

    if (today >= 12) {
        return true;
    }
    else {
        return false;
    }
}

const todaysDetail = async (req, res) => {
    const data = await Punch.todaysDetail();
    if (data) {
        res.json({ "data": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const todaysDetailMore = async (req, res) => {
    const data = await Punch.todaysDetailMore();
    if (data) {
        res.json({ "data": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const todaysLeaveDetail = async (req, res) => {
    const data = await Punch.todaysLeaveDetail();
    if (data) {
        res.json({ "data": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const fetchLeaveDetails = async (req, res) => {
    const data = await Punch.fetchLeaveDetails();
    if (data) {
        res.json({ "data": data });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    punchIn, punchOut, getPunchHistory, login, today, this_month, between_month,
    getUserList, updatePassword, punchOutNow, loginAdmin, todaysDetail, todaysDetailMore,
    todaysLeaveDetail, fetchLeaveDetails
};
