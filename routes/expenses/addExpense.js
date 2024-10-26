const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require('../../utils');




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