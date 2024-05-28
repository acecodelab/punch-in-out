// src/models/Punch.js
const pool = require('../db/db');
const nodemailer = require('nodemailer');

class Leave {
    static async leaveRequest(leaveType, leaveStartDate, reason, userId) {
        const query = 'INSERT INTO leave_requests (userId, leave_type,leave_start_date,reason) VALUES ($1,$2,$3,$4) RETURNING *';
        const values = [userId, leaveType, leaveStartDate, reason];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async myLeaveRequests(userId) {
        const query = 'SELECT t1.name,t2.id,t2.leave_type,t2.reason,t2.status,t2.leave_start_date from users t1,leave_requests t2 where t1.id=t2.userid and t1.id=$1 ORDER BY t2.id desc';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async countStatusWise(userId) {
        const query = 'SELECT  count(*), status  from leave_requests  where userid=$1 GROUP BY status';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async cancelLeaveRequest(userId, id, status = 'Cancelled') {
        const query = 'UPDATE leave_requests set status = $1 where userid=$2 and id=$3';
        const values = [status, userId, id];
        await pool.query(query, values);
        return true
    }

    static async approveLeaveRequest(id, status = 'Approve') {
        const query = 'UPDATE leave_requests set status = $1 where id=$2 RETURNING *;';
        const values = [status, id];
        var { rows } = await pool.query(query, values);
        var userid = null;
        var leave_type = null;
        var leave_start_date = null;
        rows.forEach(row => {
            // Access the specific columns
            userid = row.userid;
            leave_type = row.leave_type
            leave_start_date = row.leave_start_date
        });
        var minus_holdiay = 0;
        if (leave_type == 'Half Day Leave') {
            minus_holdiay = parseFloat(minus_holdiay) + 0.5
        }
        else if (leave_type == 'Full Day Leave') {
            minus_holdiay = parseFloat(minus_holdiay) + 1
        }
        else if (leave_type == 'Surprise Leave') {
            minus_holdiay = parseFloat(minus_holdiay) + 1
        }

        const queryUpdateLeaveCount = 'UPDATE salary set available = available - $1 , leave=leave + $1 where user_id=$2 and EXTRACT(YEAR FROM CURRENT_DATE)=year RETURNING *;';
        const valuesUpdateLeaveCount = [minus_holdiay, userid];
        await pool.query(queryUpdateLeaveCount, valuesUpdateLeaveCount);

        var userDetail = await Leave.getUserDetails(userid)
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
            from: "infonxtgenvirtue@gmail.com",
            to: userDetail.email, // User's email address
            bcc: 'piyush@nxtgenvirtue.com',
            subject: "Approved",
            text: "Hello " + userDetail.name + " ,your " + leave_type + ' for date ' + leave_start_date + " are approved.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return true
    }

    static async rejectLeaveRequest(id, status = 'Reject') {
        const query = 'UPDATE leave_requests set status = $1 where  id=$2 RETURNING *;';
        const values = [status, id];
        var { rows } = await pool.query(query, values);
        var userid = null;
        var leave_type = null;
        var leave_start_date = null;
        rows.forEach(row => {
            // Access the specific columns
            userid = row.userid;
            leave_type = row.leave_type
            leave_start_date = row.leave_start_date
        });

        var userDetail = await Leave.getUserDetails(userid)
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
            from: "infonxtgenvirtue@gmail.com",
            to: userDetail.email, // User's email address
            bcc: 'piyush@nxtgenvirtue.com',
            subject: "Rejected",
            text: "Hello " + userDetail.name + " ,your " + leave_type + ' for date ' + leave_start_date + " are rejected.Please contact your manager",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        return true
    }

    static async today(userId) {
        const query = 'SELECT t1.name,t2.id,t2.leave_type,t2.reason,t2.status,t2.leave_start_date from users t1,leave_requests t2 where DATE(t2.leave_start_date) = CURRENT_DATE and t1.id=t2.userid and t1.id=$1 ORDER BY t2.id desc';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }
    static async countStatusWiseToday(userId) {
        const query = 'SELECT count(*),status from leave_requests  where DATE(leave_start_date) = CURRENT_DATE and userid = $1 GROUP BY status';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async this_month(userId) {
        const query = `SELECT t1.name,t2.id,t2.leave_type,t2.reason,t2.status,t2.leave_start_date from users t1,leave_requests t2 where DATE_PART('month', t2.leave_start_date) = DATE_PART('month', CURRENT_DATE) and t1.id=t2.userid and t1.id=$1 ORDER BY t2.id desc`;
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async countStatusWiseThisMonth(userId) {
        const query = `SELECT count(*),status from leave_requests  where DATE_PART('month', leave_start_date) = DATE_PART('month', CURRENT_DATE) and  userid = $1 GROUP BY status`;
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async between_month(startDate, endDate, userId) {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        const query = `SELECT t1.name,t2.id,t2.leave_type,t2.reason,t2.status,t2.leave_start_date from users t1,leave_requests t2 where DATE(t2.leave_start_date) BETWEEN $1 AND $2  and t1.id=t2.userid and t1.id=$3 ORDER BY t2.id desc`;
        const values = [startDate, endDate, userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }
    static async countStatusWiseBetweenMonth(startDate, endDate, userId) {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        const query = `SELECT count(*),status from leave_requests  where DATE(leave_start_date) BETWEEN $1 AND $2 and  userid = $3 GROUP BY status`;
        const values = [startDate, endDate, userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async getUserDetails(userId) {
        const query = `SELECT * from users where id=$1`;
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async leaveCount(userId) {
        const query = 'SELECT * from salary where user_id=$1 and EXTRACT(YEAR FROM CURRENT_DATE)=year';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        return rows;
    }

}

module.exports = Leave;
