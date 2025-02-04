// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get all comments
app.get('/comments', (req, res) => {
    fs.readFile('comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read comments' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new comment
app.post('/comments', (req, res) => {
    const newComment = req.body;

    // Read existing comments
    fs.readFile('comments.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read comments' });
            return;
        }

        const comments = JSON.parse(data);
        comments.push(newComment);

        // Write updated comments back to file
        fs.writeFile('comments.json', JSON.stringify(comments, null, 4), 'utf8', (err) => {
            if (err) {
                res.status(500).json({ error: 'Failed to save comment' });
                return;
            }
            res.status(201).json(newComment);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});