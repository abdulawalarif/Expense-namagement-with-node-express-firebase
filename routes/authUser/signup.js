const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const axios = require("axios");
const { isValidEmail, isValidPassword, firebaseAPIKey } = require('../../utils');

router.use(express.urlencoded({ extended: true }));
// TODO will have refactor this code with main category create and updte
// Handle signup route
router.post('/', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        // Create the user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        });

        // Fetch categories from Firestore
        const categoriesSnapshot = await admin.firestore().collection('categories').get();

        // Store user data in Firestore, excluding categories for now
        const userRef = admin.firestore().collection('users').doc(userRecord.uid);
        await userRef.set({
            firstName,
            lastName,
            email,
        });

        // Add each category to a 'categories' subcollection in the user's document
        const batch = admin.firestore().batch();
        categoriesSnapshot.forEach(doc => {
            const data = doc.data();
            const categoryData = {
                categoryTitle: data.categoryTitle,
                description: data.description,
                created_at: data.created_at ? new Intl.DateTimeFormat('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', 
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    hour12: true, timeZone: 'UTC'
                }).format(data.created_at.toDate()) : null,
                updated_at: data.updated_at ? new Intl.DateTimeFormat('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', 
                    hour: 'numeric', minute: 'numeric', second: 'numeric', 
                    hour12: true, timeZone: 'UTC'
                }).format(data.updated_at.toDate()) : null
            };
            const categoryRef = userRef.collection('categories').doc(doc.id);
            batch.set(categoryRef, categoryData);
        });

        // Commit the batch write
        await batch.commit();

        // Authenticate the new user to get an ID token
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('returnSecureToken', 'true');

        // Use Firebase Auth REST API to sign in the user
        const response = await axios.post(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`,
            formData.toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Extract the ID token from the response
        const idToken = response.data.idToken;

        res.json({ message: 'Account created successfully', name: `${firstName} ${lastName}`, email, token: idToken });
    } catch (error) {
        // Handle Firebase Authentication errors
        switch (error.code) {
            case 'auth/email-already-exists':
                res.status(400).json({ error: 'Email already exists' });
                break;
            default:
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Server error' });
        }
    }
});

module.exports = router;
