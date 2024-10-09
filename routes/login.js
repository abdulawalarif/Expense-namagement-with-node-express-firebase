const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle login route
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify user credentials
        const user = await admin.auth().getUserByEmail(email);
        const uid = user.uid;
        
        // Check if the user exists in Firestore
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        const userData = userDoc.data();

        if (!userData || !userData.password) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const passwordHash = userData.password;

        // Now, you can safely compare the provided password with the hashed password
        const passwordMatch = (password == passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Incorrect password' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ uid: uid }, secretKey);

        res.json({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
