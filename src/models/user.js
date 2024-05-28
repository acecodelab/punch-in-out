// src/models/Punch.js
const pool = require('../db/db');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // 1MB limit
}).single('fileInput');


class User {
    static async new_user(name, username, email, password, usertype, status) {
        const query = 'INSERT INTO users (name, username, email, password, usertype, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *';
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

    static async getUserDetails(id) {
        const query = `SELECT t1.*,t2.* from users t1,employee_details t2 where t1.id=t2.user_id and t1.id=$1`;
        const { rows } = await pool.query(query, [id])
        if (rows.length > 0) {
            const profileData = {
                name: rows[0].name,
                email: rows[0].email,
                phone: rows[0].phone,
                address: rows[0].address,
                aadhar: rows[0].aadhar_card_no,
                pan: rows[0].pan_no,
                country: rows[0].country,
                state: rows[0].state,
                city: rows[0].city,
                pincode: rows[0].pincode,
                aadhar_card_no: rows[0].aadhar_card_no,
                pan_no: rows[0].pan_no,
                emergencyContact: {
                    name: rows[0].e_name,
                    relationship: rows[0].e_relation,
                    phone: rows[0].e_phone
                },
                experience: rows[0].job_details,
                dob: rows[0].dob,
                profile_pic: rows[0].profile_pic
            };
            return [profileData]
        }
        else {
            return {}
        }

    }

    static async update_details(req, res) {
        var profile_photo = null;
        return upload(req, res, async (err) => {
            if (err) {
                console.error(err);
                return;
            } else {
                if (req.file) {
                    // File uploaded successfully
                    profile_photo = req.protocol + '://' + req.get('host') + '/' + req.file.path;
                    const { userSelect, phone, region, address, stateSelect, city, pincode, aadhar, pan, emergencyName, relationSelect, emergencyPhone, experience, dob } = req.body;
                    const checkQuery = `SELECT * from employee_details where user_id=$1`;
                    var { rows } = await pool.query(checkQuery, [userSelect])
                    if (rows.length > 0) {
                        if (profile_photo == null) {
                            profile_photo = rows[0].profile_pic
                        }
                        const query = `UPDATE employee_details set phone=$1,address=$2,country=$3,state=$4,city=$5,pincode=$6,aadhar_card_no=$7,pan_no=$8,e_name=$9,e_relation=$10, e_phone=$11, job_details=$12, profile_pic=$13,dob=$14 where user_id=$15 RETURNING *;`;
                        const experienceJSON = JSON.stringify(experience);
                        var { rows } = await pool.query(query, [phone, address, region, stateSelect, city, pincode, aadhar, pan, emergencyName, relationSelect, emergencyPhone, experienceJSON, profile_photo, dob, userSelect]);
                        return rows
                    }
                    else {
                        const query = `INSERT INTO public.employee_details(
                            user_id, phone, address, country, state, city, pincode, aadhar_card_no, pan_no, e_name, e_relation,
                            e_phone, job_details, profile_pic,dob)
                            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15) RETURNING *;`
                        const experienceJSON = JSON.stringify(experience);
                        var { rows } = await pool.query(query, [userSelect, phone, address, region, stateSelect, city, pincode, aadhar, pan, emergencyName, relationSelect, emergencyPhone, experienceJSON, profile_photo, dob]);
                        return rows
                    }
                }
            }
        });

    }
}

module.exports = User;
