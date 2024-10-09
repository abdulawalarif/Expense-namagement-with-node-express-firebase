const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const secretKey = "AwalsSecretKey";

// Handle the route for updating a single todo for the authenticated user
router.put('/:todoId', async (req, res) => {
    const token = req.headers.authorization; // Get the token from the request headers
    const todoId = req.params.todoId; // Get the todo ID from the request parameters
    const updatedTodo = req.body; // Get the updated todo data from the request body

    if (!token) {
        return res.status(401).json({ success: false, error: 'Token is missing' });
    }

    try {
        const tokenWithoutBearer = token.slice(7); // Remove the first 7 characters ("Bearer ")
        const decodedToken = jwt.verify(tokenWithoutBearer, secretKey); // Use your actual secret key here

        const uid = decodedToken.uid;

        // Check if the user exists in Firestore
        const userDocRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Check if the todo exists in the user's todos
        const todoDocRef = userDocRef.collection('todos').doc(todoId);
        const todoDoc = await todoDocRef.get();

        if (!todoDoc.exists) {
            return res.status(404).json({ success: false, error: 'Todo not found' });
        }

        // Update the todo with the new data
        await todoDocRef.update(updatedTodo);

        res.json({ success: true, message: 'Todo updated successfully' });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
