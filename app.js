const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// File path to store votes
const votesFilePath = path.join(__dirname, 'votes.json');

// Initialize votes from the file or create an empty object
let votes = {};
try {
    if (fs.existsSync(votesFilePath)) {
        const votesFileContent = fs.readFileSync(votesFilePath, 'utf8');
        votes = JSON.parse(votesFileContent);
    }
} catch (error) {
    console.error('Error reading or parsing votes.json:', error.message);
}

// Set to track users who have voted
const votedUsers = new Set();

// Mapping of option values to names for question 2
const optionNamesMap = {
    q1_option1: 'Chandra',
    q1_option2: 'Aditi',
    q1_option3: 'Devyani',
    q1_option4: 'Isha',
    // Add more mappings as needed for other questions
    q2_option1: 'Dev',
    q2_option2: 'Sudarshan',
    q2_option3: 'Soham',
    q2_option4: 'Rohan',
    //
    q3_option1: 'Parth',
    q3_option2: 'Vaishnav',
    q3_option3: 'Suraj',
    q3_option4: 'Adhar',
    //
    q4_option1: 'Riya',
    q4_option2: 'Aditi',
    q4_option3: 'Lakshmi',
    q4_option4: 'Chandra',
    //
    q5_option1: 'Neha',
    q5_option2: 'Ishwari',
    q5_option3: 'Hanishka',
    q5_option4: 'Divya',
    //
    q6_option1: 'Adhar',
    q6_option2: 'Aditya',
    q6_option3: 'Soham',
    q6_option4: 'Sudarshan',
};

// Route to handle form submission
app.post('/submit', (req, res) => {
    const userName = req.body.userName;

    // Check if the user has already voted
    if (votedUsers.has(userName)) {
        console.log(`${userName} has already voted. Rejecting the vote.`);
        return res.status(400).send('User has already voted.');
    }

    // Mark the user as voted
    votedUsers.add(userName);

    const answers = req.body;

    // Update votes based on user's selections
    Object.keys(answers).forEach(questionId => {
        const selectedOption = answers[questionId];
        const key = `${questionId}_${selectedOption}`;

        // Initialize vote count for the option if not exists
        votes[key] = votes[key] || 0;

        // Increment the vote count
        votes[key]++;
    });

    // Save the votes to the file
    try {
        fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2), 'utf8');
        console.log('Votes saved to votes.json');
    } catch (error) {
        console.error('Error writing to votes.json:', error.message);
    }

    // Log a simple message for each vote
    console.log(`${userName} voted:`);
    Object.keys(votes).forEach(key => {
        // Split the key to extract questionId and option value
        const [questionId, optionValue] = key.split('_');
        // Map option value to name if a mapping exists, otherwise use the original value
        const optionName = optionNamesMap[`${questionId}_${optionValue}`] || optionValue;
        console.log(`  ${questionId}: ${optionName} - ${votes[key]} votes`);
    });

    // Send a response back to the client with a success message
    res.status(200).send('Form submitted successfully!');
});

// Route to view the contents of votes.json
app.get('/view-votes', (req, res) => {
    try {
        if (fs.existsSync(votesFilePath)) {
            // Read the content of the votes.json file
            const votesFileContent = fs.readFileSync(votesFilePath, 'utf8');

            // Parse the JSON content
            const votesData = JSON.parse(votesFileContent);

            // Send the JSON data as a response
            res.json(votesData);
        } else {
            res.status(404).send('Votes file not found');
        }
    } catch (error) {
        console.error('Error reading or parsing votes.json:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route to clear votes and start afresh
app.get('/clear-votes', (req, res) => {
    // Clear votes data
    votes = {};

    // Save the empty votes to the file
    try {
        fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2), 'utf8');
        console.log('Votes cleared and saved to votes.json');
        res.status(200).send('Votes cleared successfully.');
    } catch (error) {
        console.error('Error clearing votes:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
