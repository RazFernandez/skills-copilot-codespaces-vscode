// Create a web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// Define the path to the comments file
const commentsFilePath = 'comments.json';

// Route to get all comments
app.get('/comments', (req, res) => {
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read comments file' });
        }
        const comments = JSON.parse(data);
        res.json(comments);
    });
});

// Route to add a new comment
app.post('/comments', (req, res) => {
    const newComment = req.body;
    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read comments file' });
        }
        const comments = JSON.parse(data);
        comments.push(newComment);
        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write to comments file' });
            }
            res.status(201).json(newComment);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});