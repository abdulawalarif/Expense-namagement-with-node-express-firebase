const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle the route for getting all todos for the authenticated user (sorted by latest first)
router.get('/', async (req, res) => {
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

        // Retrieve all todos associated with the user's UID and order them by createdAt (latest first)
        const todosQuerySnapshot = await userDocRef.collection('todos').orderBy('createdAt', 'desc').get();
        const todos = [];

        todosQuerySnapshot.forEach((doc) => {
            const todoData = doc.data();
            todos.push({
                id: doc.id,
                title: todoData.title,
                description: todoData.description,
                createdAt: todoData.createdAt,
            });
        });

        res.json({ success: true, todos });
    } catch (error) {
        console.error('Error retrieving todos:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
