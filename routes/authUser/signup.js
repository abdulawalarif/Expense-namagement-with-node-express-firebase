// const express = require("express");
// const router = express.Router();
// const admin = require("firebase-admin");

// router.use(express.urlencoded({ extended: true }));

// // Handle signup route
// router.post('/', async (req, res) => {
//     const { email, password, firstName, lastName } = req.body;

//     try {
//         // Create the user in Firebase Authentication
//         const userRecord = await admin.auth().createUser({
//             email,
//             password,
//             emailVerified: false,
//             disabled: false,
//         });

//         // Store user data in Firestore (without password)
//         await admin.firestore().collection('users').doc(userRecord.uid).set({
//             firstName,
//             lastName,
//             email,
//         });

//         // Generate a Firebase Auth token
//         const userIdToken = await admin.auth().createCustomToken(userRecord.uid);

//         res.json({ success: true, message: 'Account created successfully', name:`${firstName} ${lastName}`, email: email, token: userIdToken });
//     } catch (error) {
//         // Handle Firebase Authentication errors
//         switch (error.code) {
//             case 'auth/email-already-exists':
//                 res.status(400).json({ success: false, error: 'Email already exists' });
//                 break;
//             case 'auth/invalid-email':
//                 res.status(400).json({ success: false, error: 'Invalid email format' });
//                 break;
//             case 'auth/weak-password':
//                 res.status(400).json({ success: false, error: 'Weak password' });
//                 break;
//             default:
//                 console.error('Error creating user:', error);
//                 res.status(500).json({ success: false, error: 'Server error' });
//         }
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const axios = require("axios");

const firebaseAPIKey = "AIzaSyC_vWuZBPAoI6V-BLtZTq63q0qUD8SKsfM"; 

router.use(express.urlencoded({ extended: true }));

// Handle signup route
router.post('/', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Create the user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        });

        // Store user data in Firestore (without password)
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            firstName,
            lastName,
            email,
        });

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

        res.json({ success: true, message: 'Account created successfully', name:`${firstName} ${lastName}`, email: email, token: idToken });
    } catch (error) {
        // Handle Firebase Authentication errors
        switch (error.code) {
            case 'auth/email-already-exists':
                res.status(400).json({ success: false, error: 'Email already exists' });
                break;
            case 'auth/invalid-email':
                res.status(400).json({ success: false, error: 'Invalid email format' });
                break;
            case 'auth/weak-password':
                res.status(400).json({ success: false, error: 'Weak password' });
                break;
            default:
                console.error('Error creating user:', error);
                res.status(500).json({ success: false, error: 'Server error' });
        }
    }
});

module.exports = router;
