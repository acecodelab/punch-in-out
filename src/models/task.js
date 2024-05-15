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
            filterQuery = 'user_id=$1 and date(start_time)=date(CURRENT_DATE) and status=$2 or user_id=$1 and date(start_time)=date(CURRENT_DATE) and date(end_time)=date(CURRENT_DATE) and status=$2 or user_id=$1 and  date(start_time) < date(CURRENT_DATE) and date(end_time)=date(CURRENT_DATE) and status=$2';
        }
        else if (filter == 'month') {
            filterQuery = `user_id=$1 and DATE_PART('month', start_time) = DATE_PART('month', CURRENT_DATE) and status=$2`;
        }
        else if (filter == 'between') {
            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Start date and end date are required' });
            }
            filterQuery = `user_id=$1 and DATE(start_time) BETWEEN '${startDate}' AND '${endDate}' and status=$2`;
        }
        else {
            filterQuery = ' user_id=$1 and date(start_time)=date(CURRENT_DATE) and date(end_time)=date(CURRENT_DATE) and status=$2 or user_id=$1 and  date(start_time) < date(CURRENT_DATE) and date(end_time)=date(CURRENT_DATE) and status=$2';
        }
        var query = null
        var values = null;
        if (status == 'all') {
            query = `SELECT * from tasks where user_id=$1 and date(start_time)=date(CURRENT_DATE) ORDER by id asc`;
            values = [userId];
        }
        else {
            query = `SELECT * from tasks where ` + filterQuery + `  ORDER by id desc`;
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

    static async getCurrentTask() {
        const query = `WITH latest_entries AS (
            SELECT user_id, MAX(start_time) AS start_time
            FROM tasks
            WHERE DATE_TRUNC('day', start_time) = DATE_TRUNC('day', CURRENT_DATE)
            GROUP BY user_id
        )
        SELECT t.*, u.name
        FROM tasks t
        INNER JOIN latest_entries le ON t.user_id = le.user_id AND t.start_time = le.start_time
        INNER JOIN users u ON t.user_id = u.id;`
        const { rows } = await pool.query(query, [])
        return rows
    }
}

module.exports = Task;
