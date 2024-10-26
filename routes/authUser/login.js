
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isValidEmail,isValidPassword,firebaseAPIKey } = require('../../utils');

// Replace with your Firebase Web API key here
 

// Handle login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({  error: 'Missing required fields' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({  error: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({  error: 'Password must be at least 6 characters long' });
    }


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

        res.json({  message: 'Login successful', token: idToken });
    } catch (error) {
     
        res.status(500).json({ error: 'Invalid login or password. Please try again.' });
    }
});

module.exports = router;
