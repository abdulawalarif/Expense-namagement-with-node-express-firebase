const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { verifyToken } = require('../utils');




// Endpoint to delete an expense
router.use(express.urlencoded({ extended: true }));
router.delete('/:expenseId', verifyToken, async (req, res) => {
    const { expenseId } = req.params;

    try {
        const expenseRef = admin.firestore().collection('users').doc(req.uid).collection('expenses').doc(expenseId);
        await expenseRef.delete();

        res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
module.exports = router;