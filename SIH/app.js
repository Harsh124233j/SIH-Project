const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'Login')));
app.use(express.static(path.join(__dirname, '..', 'OffbeatPage')));
app.use(express.static(path.join(__dirname))); // For SIH/ assets and style.css

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Login', 'login.html'));
});

app.get('/offbeat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'OffbeatPage', 'Offbeat.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
