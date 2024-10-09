const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = "AwalsSecretKey";

// Handle signup route
router.post('/', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Create the user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        });

        // Store user data in Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            firstName,
            lastName,
            password,
            email,
        });

        // Generate a JWT token for the user
        const token = jwt.sign({ uid: userRecord.uid }, secretKey);

        res.json({ success: true, message: 'User created successfully', token });
    } catch (error) {
        // Handle common Firebase Authentication errors
        switch (error.code) {
            case 'auth/email-already-exists':
                res.status(400).json({ success: false, error: 'Email already exists' });
                break;
            case 'auth/invalid-email':
                res.status(400).json({ success: false, error: 'Invalid email format' });
                break;
            case 'auth/weak-password':
                res.status(400).json({ success: false, error: 'Weak password' });
                break;
            default:
                console.error('Error creating user:', error);
                res.status(500).json({ success: false, error: 'Server error' });
        }
    }
});

module.exports = router;
