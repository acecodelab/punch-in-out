const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

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
