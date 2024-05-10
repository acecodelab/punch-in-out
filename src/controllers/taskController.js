// src/controllers/punchController.js
const Task = require('../models/task.js');
const nodemailer = require('nodemailer');

const submitTask = async (req, res) => {
    const { taskTitle, taskDescription, startTime, endTime, userId, status } = req.body;
    const data = await Task.submitTask(taskTitle, taskDescription, startTime, endTime, userId, status);
    if (data.length > 0) {
        res.json({ "status": true, "data": data });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], });
    }
};

const getTask = async (req, res) => {
    const { userId, status } = req.params;
    const data = await Task.getTask(userId, status);
    if (data.length > 0) {
        res.json({ "data": data });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], });
    }
}

const closeTask = async (req, res) => {
    const { id } = req.params;
    await Task.closeTask(id);
    res.json({ "status": true });
}


module.exports = {
    submitTask, getTask, closeTask
};
