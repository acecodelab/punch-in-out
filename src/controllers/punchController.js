// src/controllers/punchController.js
const Punch = require('../models/punch.js');
const nodemailer = require('nodemailer');

const punchIn = async (req, res) => {
    const { user_id, email } = req.body;
    try {
        const punchCount = await Punch.count_punch_in(user_id)

        if (punchCount >= 4) {
            // Create a transporter using Gmail SMTP
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587, // TLS port
                secure: false,//true for port  465 , false for others
                auth: {
                    user: 'rajat.thakur.1903@gmail.com', // Your Gmail address
                    pass: 'jcif zxgu nbvi mhhs' // Your Gmail password or App Password if 2-Step Verification is enabled
                }
            });

            const mailOptions = {
                from: 'rajat.thakur.1903@gmail.com',
                to: email, // User's email address
                //bcc: 'piyush@nxtgenvirtue.com',
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
            const punch = await Punch.create({ user_id, punch_type: 'in' });
            res.json({ success: true, error: 'Exceeded maximum punch in limit for today.Your details are forward to Officials', data: punch });
        } else {
            const punch = await Punch.create({ user_id, punch_type: 'in' });
            res.json({ success: true, data: punch, error: null });
        }
    } catch (error) {
        console.error('Error punching in:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const punchOut = async (req, res) => {
    const { user_id } = req.body;
    try {
        const punch = await Punch.create({ user_id, punch_type: 'out' });
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
        res.json({ success: true, data: { punches, totalOutTime } });
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
module.exports = { punchIn, punchOut, getPunchHistory, login, today, this_month, between_month, getUserList };