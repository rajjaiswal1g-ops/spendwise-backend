const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Database Connection Logic
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully! ✅"))
.catch((err) => console.log("MongoDB Connection Error: ❌", err));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("SpendWise API is running...");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});