const express = require('express');
const cron = require('node-cron');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require('cors');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const PORT = process.env.PORT || 3000;
const punchOut = require('../src/controllers/punchController.js')
app.use(useragent.express());

// Schedule cron job to run at 7:00 PM daily
cron.schedule('0 19 * * *', async () => {
    await punchOut.punchOutNow();
    console.log('Punch Out Office over Time');
}, {
    timezone: 'Asia/Kolkata' // Specify your timezone, e.g., 'Asia/Kolkata'
});

// Schedule the task to run at 1:30 PM every day
cron.schedule('30 13 * * *', async () => {
    await punchOut.punchOutNow();
    console.log('Punch Out Lunch Time');
    io.emit('lunchTime', '');
}, {
    timezone: 'Asia/Kolkata' // Specify your timezone, e.g., 'Asia/Kolkata'
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static('public'));

// Routes
const routes = require('./routes');
app.use('/', routes);

app.get('/', (req, res) => {
    const networkIpAddress = req.connection.remoteAddress;
    res.send(`Request received from network IP address: ${networkIpAddress}`);
});

//Whenever someone connects this gets executed
io.on('connection', function (socket) {
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
    });
});

// Start server
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
