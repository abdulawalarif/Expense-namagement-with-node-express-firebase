const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isValidEmail, isValidPassword, firebaseAPIKey } = require('../../utils');

// Handle login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('returnSecureToken', 'true');

        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`,
            formData.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const idToken = response.data.idToken;
        res.status(200).json({ message: 'Login successful', token: idToken });
    } catch (error) {
        if (error.response) {
            // Firebase API responded with a non-2xx status code
            const status = error.response.status;
            if (status === 400) {
                return res.status(400).json({ error: 'Invalid login or password. Please try again.' });
            } else if (status >= 500) {
                return res.status(503).json({ error: 'Firebase server is temporarily unavailable. Please try again later.' });
            } else {
                return res.status(status).json({ error: 'An error occurred. Please try again.' });
            }
        } else if (error.request) {
            // Request was made but no response was received
            return res.status(503).json({ error: 'No response from server. Please check your network connection and try again.' });
        } else {
            // Something went wrong while setting up the request
            return res.status(500).json({ error: 'An internal error occurred. Please try again.' });
        }
    }
});

module.exports = router;
