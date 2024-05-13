// src/models/Punch.js
const pool = require('../db/db');
const nodemailer = require('nodemailer');

class Task {
    static async submitTask(title, description, userId, status) {
        const query = 'INSERT INTO tasks (user_id,title, description,status,start_time) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [userId, title, description, status, 'now()'];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async getTask(userId, status, filter, startDate, endDate) {
        var filterQuery = '';
        if (filter == 'today') {
            filterQuery = 'and date(start_time)=date(CURRENT_DATE)';
        }
        else if (filter == 'month') {
            filterQuery = `and DATE_PART('month', start_time) = DATE_PART('month', CURRENT_DATE)`;
        }
        else if (filter == 'between') {
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Start date and end date are required' });
            }
            filterQuery = `and DATE(start_time) BETWEEN '${startDate}' AND '${endDate}'`;
        }
        else {
            filterQuery = 'and date(start_time)=date(CURRENT_DATE)';
        }
        var query = null
        var values = null;
        if (status == 'all') {
            query = `SELECT * from tasks where user_id=$1 and date(start_time)=date(CURRENT_DATE) ORDER by id asc`;
            values = [userId];
        }
        else {
            query = `SELECT * from tasks where user_id=$1 ` + filterQuery + ` and status=$2 ORDER by id desc`;
            values = [userId, status];
        }

        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async closeTask(id) {
        const query = `UPDATE tasks set status='close',end_time=now() where id=$1`;
        const values = [id];
        await pool.query(query, values);
        return true
    }
}

module.exports = Task;