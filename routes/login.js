
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Replace with your Firebase Web API key here
const firebaseAPIKey = "AIzaSyC_vWuZBPAoI6V-BLtZTq63q0qUD8SKsfM"; 
 
// TODO missing api key say error as email is missing.. will have to configure it 

// Handle login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Format the data as application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('returnSecureToken', 'true');

        // Call Firebase Auth REST API to verify email and password
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`,
            formData.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
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
