// src/models/Punch.js
const pool = require('../db/db');
const nodemailer = require('nodemailer');

class User {
    static async new_user(name, username, email, password, usertype, status) {
        const query = 'INSERT INTO users (name, password,username,email,usertype,status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
        const values = [name, username, email, password, usertype, status];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async get_user_list() {
        const query = 'SELECT * from users order by status asc';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async sendPassword(id) {
        const query = 'SELECT * from users where id=$1';
        const { rows } = await pool.query(query, [id]);
        return rows;
    }
    static async changeStatus(id) {
        const query = `UPDATE users SET status = CASE WHEN status = 'active' THEN 'deactive' WHEN status = 'deactive' THEN 'active' END WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        return rows;
    }

}

module.exports = User;
