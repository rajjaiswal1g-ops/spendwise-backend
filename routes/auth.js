const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Pehle check karein ki user pehle se toh nahi hai
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Password ko hash (secure) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Naya user create karein (hashed password ke saath)
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword 
        });

        // 4. Database mein save karein
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
// LOGIN ROUTE

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // DHAYAN DEIN: Sirf ek hi res.status hona chahiye pure logic ke baad
        return res.status(200).json({ 
            message: "Login Successful!",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;