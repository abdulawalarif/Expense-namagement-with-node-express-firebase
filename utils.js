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
    firebaseAPIKey
};