const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware to verify ID token and get user data
/// TODO can replacte this code with the utils code
async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1]; // Extract token from "Authorization" header
    
    if (!idToken) {
        return res.status(401).json({ success: false, error: 'Authorization token missing' });
    }

    try {
        // Verify the token and get the uid
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid; // Attach uid to the request for later use
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
}

// Endpoint to get user data from Firestore
router.get('/', verifyToken, async (req, res) => {
    try {
        // Use the uid from the verified token to get user data from Firestore
        const userDoc = await admin.firestore().collection('users').doc(req.uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Send user data as response
        const userData = userDoc.data();
        const filteredData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        };
        res.json({ success: true, user: filteredData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});


// Endpoint to update user data in Firestore
router.put('/', verifyToken, async (req, res) => {
    try {
        const { firstName, lastName } = req.body;

        // Validate input
        if (!firstName && !lastName) {
            return res.status(400).json({ success: false, error: 'No fields to update' });
        }

        // Prepare the data to update only the provided fields
        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
    

        // Update the user document in Firestore
        const userRef = admin.firestore().collection('users').doc(req.uid);
        await userRef.update(updateData);

        // Respond with success message
        res.json({ message: 'User data updated successfully', data:{firstName: firstName, lastName:lastName}});
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});



module.exports = router;
