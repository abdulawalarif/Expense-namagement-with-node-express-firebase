const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Middleware to verify ID token and get user data
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
router.use(express.urlencoded({ extended: true }));
router.post('/', verifyToken, async (req, res) => {
    const { categoryId, amount,date, description} = req.body;
 
     try {                                            
        // Add an expense sub-collection for each user
     await admin.firestore().collection('users').doc(req.uid).collection('expenses').add({
    categoryId: categoryId,
    amount: amount,
    date:date,
    description:description,
    created_at: admin.firestore.FieldValue.serverTimestamp(),  
    
   
});

 
res.json({ message: 'Added an expenses successfully',});
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;