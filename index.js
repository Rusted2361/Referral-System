//using Express framework
require('dotenv').config();
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample in-memory database (replace with a real database in production)
const users = new Map();

//test function
app.get('/', (req,res) => {
    res.send('Helloworld');
})

// Referral link generation API
app.post('/gen-reference-link', (req, res) => {
    const referrer = req.body.referrer;
    if (!referrer) {
        return res.status(400).json({ error: 'Referrer wallet address is required.' });
    }
    const referralLink = generateReferralLink(referrer);
    res.json({ referralLink });
});

// User registration API with referral link
app.post('/register', (req, res) => {
    const { name, email, referralLink } = req.body;
    const referrer = getReferrerFromLink(referralLink);
    const user = { name, email, referrer };
    users.set(email, user); // Store user in the database
    res.json({ message: 'User registered successfully' });
});

// Get referrer wallet API
app.get('/referrer/:email', (req, res) => {
    const userEmail = req.params.email;
    const user = users.get(userEmail);
    if (user) {
        res.json({ referrer: user.referrer });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Helper function to generate referral link
function generateReferralLink(referrer) {
    // Generate unique referral link using referrer's ID or wallet address
    return `storagechain/invite/${referrer}`;
}

// Helper function to extract referrer from referral link
function getReferrerFromLink(referralLink) {
    // Parse referral link to extract referrer's ID or wallet address
    const parts = referralLink.split('/');
    return parts[3]; // Assuming referrer is the third part of the URL
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
