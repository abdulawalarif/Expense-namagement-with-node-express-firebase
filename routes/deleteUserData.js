const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require('../utils');

router.use(express.urlencoded({ extended: true }));

router.delete('/', verifyToken, async (req, res) => {
    const uid = req.uid;  

    try {
        const userRef = admin.firestore().collection('users').doc(uid);
        const subcollections = await userRef.listCollections();
        const batch = admin.firestore().batch();
        for (const subcollection of subcollections) {
            const snapshot = await subcollection.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
        }
        await batch.commit();
        await userRef.delete();
        await admin.auth().deleteUser(uid);
        res.json({ success: true, message: 'Your account and data have been deleted successfully' });
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ success: false, error: error });
    }
});
module.exports = router;
