const express = require('express');
const cron = require('node-cron');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const PORT = process.env.PORT || 3000;
const punchOut = require('../src/controllers/punchController.js')
app.use(useragent.express());

// Schedule cron job to run at 7:00 PM daily
cron.schedule('0 19 * * *', async () => {
    await punchOut.punchOutNow();
    console.log('Punch Out Time');
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


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
