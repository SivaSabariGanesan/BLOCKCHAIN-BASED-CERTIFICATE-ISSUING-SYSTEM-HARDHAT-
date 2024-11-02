const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CV', {}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    try {
        // Define an array of dummy users
        const dummyUsers = [
            { username: 'user1', password: 'password123' },
            { username: 'user2', password: 'password456' },
            { username: 'user3', password: 'password789' },
            { username: 'user4', password: 'password101' },
            { username: 'user5', password: 'password202' },
        ];

        // Check if the users already exist, if not, create them
        for (const user of dummyUsers) {
            const existingUser = await User.findOne({ username: user.username });
            if (!existingUser) {
                await User.create(user);
                console.log(`Dummy user created: ${user.username}`);
            }
        }
    } catch (error) {
        console.error('Error creating dummy users:', error);
    }
});

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// Create User model
const User = mongoose.model('User', userSchema);

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username, password });
        
        if (user) {
            res.status(200).json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in /login endpoint:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
