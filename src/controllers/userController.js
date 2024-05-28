// src/controllers/punchController.js
const User = require('../models/user.js');
const nodemailer = require('nodemailer');

const new_user = async (req, res) => {
    const { name, username, email, password, usertype, status } = req.body;
    const data = await User.new_user(name, username, email, password, usertype, status)
    if (data) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // TLS port
            secure: false,//true for port  465 , false for others
            auth: {
                user: 'infonxtgenvirtue@gmail.com', // Your Gmail address
                pass: 'pwuh rpja vilo zkkb' // Your Gmail password or App Password if 2-Step Verification is enabled
            }
        });

        let htmlContent = `
        <html>
        <head>
            <style>
                table {
                    font-family: Arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }
                th, td {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>

        <table>
        <tr>
            <th>Name</th>
            <th>username</th>
            <th>password</th>
        </tr>
        <tr>
            <td>${name}</td>
            <td>${username}</td>
            <td>${password}</td>
        </tr>
        </table>
        <h2>Reason:</h2>
        <p>Portal link:- http://156.67.210.176:3000/user/</p>
        <p>Login with above credentials and change your password.</p>
        </body>
        </html>
        `;

        const mailOptions = {
            from: "infonxtgenvirtue@gmail.com",
            to: email, // User's email address
            subject: "Portal Activated",
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.json({ "status": true, "data": data });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], });
    }
};

const get_user_list = async (req, res) => {
    const data = await User.get_user_list()
    if (data.length > 0) {
        res.json({ "status": true, "data": data });
    }
    else {
        res.json({ "status": false, "data": null });
    }
}

const sendPassword = async (req, res) => {
    const { id } = req.body;
    await User.sendPassword(id)
    res.json({ "status": true, "data": [] });
}
const changeStatus = async (req, res) => {
    const { id } = req.body;
    await User.changeStatus(id)
    res.json({ "status": true, "data": [] });
}

const getUserDetails = async (req, res) => {
    const { id } = req.params;
    var data = await User.getUserDetails(id)
    res.json({ "status": true, "data": data });
}

const update_details = async (req, res) => {
    var data = await User.update_details(req, res)
    res.json({ "status": true, data: data });
}

module.exports = {
    new_user, get_user_list, sendPassword, changeStatus, getUserDetails, update_details
};
