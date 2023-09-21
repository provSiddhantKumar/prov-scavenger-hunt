const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));

const scavengerHunts = [
    {
        teamId: 'team1',
        riddles: [
            { id: 'aX5j9mR', passcode: 'smart1', riddleText: 'First riddle for Team Alpha...' },
            { id: 'zQ8p7lK', passcode: 'smart2', riddleText: 'Second riddle for Team Alpha...' },
            // ... other riddles for Team Alpha
        ]
    },
    // ... other teams
];

app.get('/:teamId/riddle/:riddleId', (req, res) => {
    const teamId = req.params.teamId;
    const riddleId = req.params.riddleId;

    const teamData = scavengerHunts.find(team => team.teamId === teamId);

    if (!teamData) {
        res.status(404).json({ status: "error", message: "Team not found!" });
        return;
    }

    const riddleData = teamData.riddles.find(riddle => riddle.id === riddleId);

    if (!riddleData) {
        res.status(404).json({ status: "error", message: "Riddle not found!" });
        return;
    }

    res.sendFile(`${riddleId}.html`, { root: path.join(__dirname, 'public', teamId) });
});

app.post('/:teamId/riddle/:riddleId/validate', (req, res) => {
    const teamId = req.params.teamId;
    const riddleId = req.params.riddleId;

    const teamData = scavengerHunts.find(team => team.teamId === teamId);

    if (!teamData) {
        res.status(404).json({ status: "error", message: "Team not found!" });
        return;
    }

    const riddleData = teamData.riddles.find(riddle => riddle.id === riddleId);

    if (!riddleData) {
        res.status(404).json({ status: "error", message: "Riddle not found!" });
        return;
    }

    if (req.body.passcode === riddleData.passcode) {
        res.json({ status: "success" });
    } else {
        res.json({ status: "error", message: "Incorrect passcode!" });
    }
});

// ... [all your routes and other middleware functions]

// Middleware for handling 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).sendFile('404.html', { root: path.join(__dirname, 'public') });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
