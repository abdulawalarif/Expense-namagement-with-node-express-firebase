const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle the route for updating user information
router.put('/', async (req, res) => {
    const token = req.headers.authorization; // Get the token from the request headers

    if (!token) {
        return res.status(401).json({ success: false, error: 'Token is missing' });
    }

    try {
        const tokenWithoutBearer = token.slice(7); // Remove the first 7 characters ("Bearer ")
        const decodedToken = jwt.verify(tokenWithoutBearer, secretKey); // Use your actual secret key here

        const uid = decodedToken.uid;

        // Retrieve user data from Firestore using the UID
        const userDocRef = admin.firestore().collection('users').doc(uid);

        // Check if the user exists
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Update user's first name and last name
        const { firstName, lastName } = req.body;
        await userDocRef.update({ firstName, lastName });

        res.json({ success: true, message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
