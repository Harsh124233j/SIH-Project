const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, '..'));

// Helper to extract userName from cookies manually
function getUserFromCookie(req) {
    if (req.headers.cookie) {
        const match = req.headers.cookie.match(/(?:^|; )userName=([^;]*)/);
        if (match) return decodeURIComponent(match[1]);
    }
    return null;
}

app.get('/', (req, res) => {
    res.render('SIH/index.html', { user: getUserFromCookie(req) });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Login', 'login.html'));
});

app.get('/offbeat', (req, res) => {
    res.render('OffbeatPage/Offbeat.html', { user: getUserFromCookie(req) });
});

app.use(express.static(path.join(__dirname, '..', 'Login'), { index: false }));
app.use(express.static(path.join(__dirname, '..', 'OffbeatPage'), { index: false }));
app.use(express.static(path.join(__dirname), { index: false })); // For SIH/ assets and style.css

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
