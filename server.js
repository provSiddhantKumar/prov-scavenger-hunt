const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));

const team1Riddle = "In a haven where wild hearts roam free,\nAmong the bleats, not the tree,\nSeek the pattern, square and quaint,\nScan its secrets, with no restraint.";
const team2Riddle = "At beginnings and ends, pathways entwine,\nTo the side most silent, seek the subtle sign.\nAmidst the stride, a cipher lies in shade,\nCapture its essence, for the game to be played.";
const team3Riddle = "Where journeys begin and tales intertwine,\nBetween known and unknown, there's a thin line. \nWith columns as guards, though no doorplate,\nDiscover the hint where beginnings await.";
const team4Riddle = "Whispers of water, a ballet in play, \nWhere droplets shimmer, in a rhythmic array. \nNot the vast ocean, nor a babbling brook, \nFind the heart's desires, in this nook.";

const scavengerHunts = [
    {
        teamId: 'team1',
        riddles: [
            { id: 'aX5j9mR', passcode: 'storm', riddleText: team1Riddle },
            // ... other riddles for Team Alpha
        ],
        teamId: 'team2',
        riddles: [
            { id: 'zQ8p7lK', passcode: 'roast', riddleText: team2Riddle },
            // ... other riddles for Team Alpha
        ],
        teamId: 'team3',
        riddles: [
            { id: 'ajJJ9mY', passcode: 'steam', riddleText: team3Riddle },
            // ... other riddles for Team Alpha
        ],
        teamId: 'team4',
        riddles: [
            { id: 'sfglsoe', passcode: 'clock', riddleText: team4Riddle },
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
