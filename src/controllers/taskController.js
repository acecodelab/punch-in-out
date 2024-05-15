// src/controllers/punchController.js
const Task = require('../models/task.js');
const nodemailer = require('nodemailer');

const submitTask = async (req, res) => {
    const { taskTitle, taskDescription, userId, status } = req.body;
    const data = await Task.submitTask(taskTitle, taskDescription, userId, status);
    if (data.length > 0) {
        res.json({ "status": true, "data": data });
    }
    else {
        res.status(200).json({ "status": false, error: 'Internal server error', data: [], });
    }
};

const getTask = async (req, res) => {
    const { userId, status } = req.params;
    const data = await Task.getTask(userId, status, 'today', null, null);
    if (data.length > 0) {
        res.json({ "data": data });
    }
    else {
        res.json({ "data": [] });
    }
}

const closeTask = async (req, res) => {
    const { id } = req.params;
    await Task.closeTask(id);
    res.json({ "status": true });
}
const taskToday = async (req, res) => {
    const { userId, status } = req.query;
    const data = await Task.getTask(userId, status, 'today', null, null);
    if (data.length > 0) {
        res.json({ "data": data });
    }
    else {
        res.json({ "data": [] });
    }
}
const taskThisMonth = async (req, res) => {
    const { userId, status } = req.query;
    const data = await Task.getTask(userId, status, 'month', null, null);
    if (data.length > 0) {
        res.json({ "data": data });
    }
    else {
        res.json({ "data": [] });
    }
}
const taskBetweenDates = async (req, res) => {
    const { userId, status, startDate, endDate } = req.query;
    const data = await Task.getTask(userId, status, 'between', startDate, endDate);
    if (data.length > 0) {
        res.json({ "data": data });
    }
    else {
        res.json({ "data": [] });
    }
}

const getCurrentTask = async (req, res) => {
    const data = await Task.getCurrentTask();
    if (data.length > 0) {
        res.json({ "status": true, "data": data });
    }
    else {
        res.json({ "status": false, "data": [] });
    }
}
module.exports = {
    submitTask, getTask, closeTask, taskToday, taskThisMonth, taskBetweenDates, getCurrentTask
};
