const axios = require('axios');

const restrictAccessByIP = async (req, res, next) => {
    try {
        const response = await axios.get('https://api64.ipify.org?format=json');
        const ipAddress = response.data.ip;
        const allowedIPs = ['49.249.21.166', '122.186.85.262'];
        const clientIP = ipAddress; // Get the client's IP address
        if (allowedIPs.includes(clientIP)) {
            // If client's IP is allowed, proceed to the next middleware/route handler
            next();
        } else {
            // If client's IP is not allowed, send a 403 Forbidden response
            res.status(403).send({ "msg": "Please login from office" });
        }
    } catch (error) {
        console.error('Error fetching public IP:', error.message);
        return null;
    }
}

module.exports = { restrictAccessByIP }
