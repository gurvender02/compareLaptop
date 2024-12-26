import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const PORT = 3306;

app.use(cors());
app.use(express.json());

// MySQL connection
// const db = mysql.createConnection({
//     host: 'sql12.freesqldatabase.com',
//     user: 'sql12747972',
//     password: 'SI5DXUjQhD',
//     database: 'sql12747972',
// });



// const db = mysql.createConnection({
//     host: 'sql12.freesqldatabase.com',
//     user: 'sql12747961',
//     password: 'zZUN9ag8wb',
//     database: 'sql12747961',
// });

const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12747969',
    password: 'IAbV2UaqKq',
    database: 'sql12747969',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database!');
        hello(); // Call the function after connection is established
    }
});

// Function to fetch and log data from the database
const hello = () => {
    console.log("Attempting to fetch data from the database...");
    const query = `SELECT * FROM database2`; // Ensure "Profile" is a valid table in your database
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
        } else {
            console.log('Fetched data:', results); // Log all data from the table
        }
    });
};

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
