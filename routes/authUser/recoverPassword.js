
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
 
const { isValidEmail } = require('../../utils');

// Password recovery route
router.use(express.urlencoded({ extended: true }));
router.post('/', async (req, res) => {
    const { email } = req.body;

    // Validate email field
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Send password reset email using Firebase Auth
        await admin.auth().generatePasswordResetLink(email);

        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        // Handle errors
        switch (error.code) {
            case 'auth/user-not-found':
                res.status(404).json({ error: 'User with this email not found' });
                break;
            default:
                 
                res.status(500).json({ error: error });
        }
    }
});

module.exports = router;
