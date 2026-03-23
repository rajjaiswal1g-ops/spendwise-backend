const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// 1. Transaction ADD karne ke liye
router.post('/add', protect, async (req, res) => {
    try {
        const { name, amount, category, type, date, emoji } = req.body;

        const newTransaction = new Transaction({
            userId: req.user, // Middleware se aayi ID
            name,
            amount,
            category,
            type,
            date,
            emoji
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error("Add Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. User ki transactions GET karne ke liye
router.get('/all', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. Transaction DELETE karne ke liye
router.delete('/:id', protect, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        // Check karein ki user sirf apni hi transaction delete kare
        if (transaction.userId.toString() !== req.user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await transaction.deleteOne();
        res.json({ message: "Transaction removed ✅" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;