const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const axios = require("axios");

// Replace with your Firebase Web API key here
const firebaseAPIKey = "AIzaSyC_vWuZBPAoI6V-BLtZTq63q0qUD8SKsfM"; 

// Handle login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call Firebase Auth REST API to verify email and password
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`,
            { email, password, returnSecureToken: true }
        );

        // Extract the ID token from the response
        const idToken = response.data.idToken;

        res.json({ success: true, message: 'Login successful', token: idToken });
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data.error) {
            const errorCode = error.response.data.error.message;
            switch (errorCode) {
                case 'EMAIL_NOT_FOUND':
                    return res.status(401).json({ success: false, error: 'Email not found' });
                case 'INVALID_PASSWORD':
                    return res.status(401).json({ success: false, error: 'Incorrect password' });
                default:
                    return res.status(500).json({ success: false, error: 'Server error' });
            }
        }
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
