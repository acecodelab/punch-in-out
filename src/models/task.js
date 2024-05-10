// src/models/Punch.js
const pool = require('../db/db');
const nodemailer = require('nodemailer');

class Task {
    static async submitTask(title, description, startTime, endTime, userId, status) {
        if (status == 'open') {
            endTime = null
        }
        const query = 'INSERT INTO tasks (user_id,title, description, start_time, end_time,status) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *';
        const values = [userId, title, description, startTime, endTime, status];
        const { rows } = await pool.query(query, values);
        return rows;
    }

    static async getTask(userId, status) {
        var query = null
        var values = null;
        if (status == 'all') {
            query = 'SELECT * from tasks where user_id=$1 and date(start_time)=date(CURRENT_DATE) ORDER by id asc';
            values = [userId];
        }
        else {
            query = 'SELECT * from tasks where user_id=$1 and date(start_time)=date(CURRENT_DATE) and status=$2 ORDER by id desc';
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
