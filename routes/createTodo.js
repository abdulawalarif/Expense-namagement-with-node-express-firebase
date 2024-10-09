const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle the route for creating a new todo
router.post('/', async (req, res) => {
    const token = req.headers.authorization; // Get the token from the request headers

    if (!token) {
        return res.status(401).json({ success: false, error: 'Token is missing' });
    }

    try {
        const tokenWithoutBearer = token.slice(7); // Remove the first 7 characters ("Bearer ")
        const decodedToken = jwt.verify(tokenWithoutBearer, secretKey); // Use your actual secret key here

        const uid = decodedToken.uid;

        // Retrieve user data from Firestore using the UID to ensure the user exists
        const userDocRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Create a new todo and associate it with the user's UID
        const { title, description } = req.body;
        const timestamp = admin.firestore.FieldValue.serverTimestamp(); // Add a timestamp field
        const todoData = {
            title,
            description,
            userId: uid, // Associate the todo with the user's UID
            createdAt: timestamp, // Add a createdAt timestamp
        };

        // Generate a new unique ID for the todo
        const newTodoRef = userDocRef.collection('todos').doc();
        await newTodoRef.set(todoData);

        res.json({ success: true, message: 'Todo created successfully' });
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
