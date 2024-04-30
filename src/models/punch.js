// src/models/Punch.js
const pool = require('../db/db');

class Punch {
    static async create({ user_id, punch_type, type }) {
        const queryCheck = 'SELECT * from punches where user_id=$1 and date(timestamp)=date(CURRENT_DATE) order by id desc LIMIT 1';
        var { rows } = await pool.query(queryCheck, [user_id])
        if (rows.length > 0) {
            if (rows[0].punch_type == 'out' && punch_type == 'out') {
                return rows[0];
            }
            else if (rows[0].punch_type == 'out' && punch_type == 'in' || rows[0].punch_type == 'in' && punch_type == 'out') {
                const query = 'INSERT INTO punches (user_id, punch_type,type) VALUES ($1, $2, $3) RETURNING *';
                const values = [user_id, punch_type, type];
                var { rows } = await pool.query(query, values);
                return rows[0];
            }

        }
        else {
            const query = 'INSERT INTO punches (user_id, punch_type,type) VALUES ($1, $2, $3) RETURNING *';
            const values = [user_id, punch_type, type];
            var { rows } = await pool.query(query, values);
            return rows[0];
        }

    }

    static async getByUserId(user_id) {
        const query = 'SELECT * FROM punches WHERE user_id = $1 and date(timestamp)=CURRENT_DATE ORDER BY timestamp DESC';
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }

    static async getByUserIdForMonth(user_id) {
        const query = `SELECT * FROM punches WHERE user_id = $1 and DATE_PART('month', timestamp) = DATE_PART('month', CURRENT_DATE) ORDER BY timestamp DESC`;
        const { rows } = await pool.query(query, [user_id]);
        return rows;
    }

    static async loginUser(username, password) {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        const user = result.rows[0];
        return user;
    }
    static async count_punch_in(user_id) {
        const result = await pool.query('SELECT COUNT(*) FROM punches WHERE user_id = $1 AND punch_type = $2 AND date(timestamp) = CURRENT_DATE', [user_id, 'in']);
        const punchCount = parseInt(result.rows[0].count, 10);
        return punchCount;
    }

    static async today(userId) {
        const getTodayReportsQuery = 'SELECT t2.name, t1.punch_type, t1.timestamp FROM punches t1,users t2 WHERE DATE(t1.timestamp) = CURRENT_DATE and t1.user_id=t2.id and t2.id=$1 ORDER BY t1.timestamp DESC';
        const { rows } = await pool.query(getTodayReportsQuery, [userId]);
        return rows;
    }

    static async this_month(userId) {
        const getThisMonthReportsQuery = `SELECT t2.name, t1.punch_type, t1.timestamp FROM punches t1,users t2 WHERE DATE_PART('month', timestamp) = DATE_PART('month', CURRENT_DATE)  and t1.user_id=t2.id and t2.id=$1 ORDER BY t1.timestamp DESC`;
        const { rows } = await pool.query(getThisMonthReportsQuery, [userId]);
        return rows;
    }

    static async between_month(startDate, endDate, userId) {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }
        const getReportsBetweenDatesQuery = 'SELECT t2.name, t1.punch_type, t1.timestamp FROM punches t1,users t2 WHERE DATE(timestamp) BETWEEN $1 AND $2  and t1.user_id=t2.id and t2.id=$3 ORDER BY t1.timestamp DESC';
        const { rows } = await pool.query(getReportsBetweenDatesQuery, [startDate, endDate, userId]);
        return rows;
    }

    static async getUserList() {
        const getUserList = 'SELECT * from users';
        const { rows } = await pool.query(getUserList);
        return rows;
    }

    static async updatePassword(c_password, n_password, userId) {
        const checkPassword = 'SELECT * from users where id=$1';
        const { rows } = await pool.query(checkPassword, [userId]);
        if (rows[0].password == c_password) {
            const updatePassword = 'UPDATE users set password=$1 where id=$2';
            await pool.query(updatePassword, [n_password, userId]);
            return true;
        }
        else {
            return false
        }
    }

    static async punchOutNow() {
        const checkOpenpunchOut = `WITH LastEntry AS (SELECT user_id, punch_type, timestamp FROM punches WHERE (user_id, timestamp) IN (SELECT user_id, MAX(timestamp) AS max_timestamp FROM punches GROUP BY user_id)) INSERT INTO punches (user_id, punch_type, timestamp) SELECT user_id, 'out', NOW() FROM LastEntry WHERE punch_type = 'in';`;
        await pool.query(checkOpenpunchOut);
        return true;
    }
}

module.exports = Punch;
