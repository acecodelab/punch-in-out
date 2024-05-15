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


}

module.exports = User;
