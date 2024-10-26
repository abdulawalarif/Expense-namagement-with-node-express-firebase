const NodeCache = require("node-cache");
const tokenCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // TTL in seconds
const admin = require("firebase-admin");
// Middleware to verify ID token and get user data

async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    
    if (!idToken) {
        return res.status(401).json({ success: false, error: 'Authorization token missing' });
    }

    // Check if token is cached
    const cachedUid = tokenCache.get(idToken);
    if (cachedUid) {
        req.uid = cachedUid; // Use cached UID
        return next();
    }

    // Verify token with Firebase if not in cache
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        
        // Cache the UID with token as the key
        tokenCache.set(idToken, decodedToken.uid);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ success: false, error: 'Unauthorized' });
    }
}


const isValidEmail = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return emailRegex.test(email);
};
const isValidPassword = (password) => {
    return password && password.length >= 6;
};
const firebaseAPIKey = "AIzaSyC_vWuZBPAoI6V-BLtZTq63q0qUD8SKsfM"; 







module.exports = {
    isValidEmail,
    isValidPassword,
    firebaseAPIKey,
    verifyToken
};