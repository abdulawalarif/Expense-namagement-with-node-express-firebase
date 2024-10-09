const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle the route for getting specific user names with JWT
router.get('/', async (req, res) => {
    const token = req.headers.authorization; // Get the token from the request headers

    if (!token) {
        return res.status(401).json({ success: false, error: 'Token is missing' });
    }

    try {
        const tokenWithoutBearer = token.slice(7); // Remove the first 7 characters ("Bearer ")

        const decodedToken = jwt.verify(tokenWithoutBearer, secretKey); // Use your actual secret key here
        const uid = decodedToken.uid;

        // Retrieve user data from Firestore using the UID
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        const userData = userDoc.data();

        if (!userData) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Remove the "password" field from the userData object
        delete userData.password;

        res.json({ success: true, user: userData });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
