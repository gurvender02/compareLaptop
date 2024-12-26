import express from 'express';
import mysql from "mysql2";
import cors from 'cors';
const app = express();
const PORT = 5000; // Use a non-conflicting port

app.use(cors());
app.use(express.json());

// Anish db
const db1 = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12747961',
    password: 'zZUN9ag8wb',
    database: 'sql12747961',
});

// My db
const db2 = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12747969',
    password: 'IAbV2UaqKq',
    database: 'sql12747969',
});

// user information stored in this db
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12747972',
    password: 'SI5DXUjQhD',
    database: 'sql12747972',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database login!');
    }
});

// Connect to databases
db1.connect(err => {
    if (err) {
        console.error("Error connecting to Remote DB:", err);
    } else {
        console.log("Connected to Remote DB anish!");
    }
});

db2.connect(err => {
    if (err) {
        console.error("Error connecting to Localhost DB:", err);
    } else {
        console.log("Connected to Localhost my DB!");
    }
});

// Endpoint to merge data from both databases
app.get("/merged", (req, res) => {
    const query1 = "SELECT * FROM `database1`;"; // Replace with the actual table name
    const query2 = "SELECT * FROM `database2`;"; // Replace with the actual table name

    db1.query(query1, (err, data1) => {
        if (err) {
            console.error("Error fetching data from database1:", err);
            return res.status(500).json({ error: "Error fetching data from database1", details: err });
        }

        db2.query(query2, (err, data2) => {
            if (err) {
                console.error("Error fetching data from database2:", err);
                return res.status(500).json({ error: "Error fetching data from database2", details: err });
            }

            const mergedData = { database1: data1, database2: data2 };
            return res.json(mergedData);
        });
    });
});

// Custom query function to log all queries
const executeQuery = (query, params = [], callback) => {
    console.log('Executing query:', query, 'with params:', params);
    db.query(query, params, callback);
};

// Routes using the logging query function
app.get('/customers', (req, res) => {
    const query = `
        SELECT profile_id, first_name, last_name, username, address, 
               phone_number, gender, created_at 
        FROM Profile
    `;
    executeQuery(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Total sales
app.get('/api/sales/total', (req, res) => {
    const query = `SELECT SUM(price) AS total_sales FROM Purchase`;
    executeQuery(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching total sales:', err);
            return res.status(500).send(err);
        }
        res.json(results[0]); // Send first result
    });
});

// Last month's sales
app.get('/api/sales/last-month', (req, res) => {
    const query = `
        SELECT SUM(price) AS total_sales_last_month 
        FROM Purchase 
        WHERE date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') 
        AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `;
    executeQuery(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching last month\'s sales:', err);
            return res.status(500).send(err);
        }
        res.json(results[0]);
    });
});

// Endpoint to get golden customers
app.get('/golden-customers', (req, res) => {
    const query = `
        SELECT p.profile_id, p.first_name, p.last_name, p.username, SUM(pr.price) AS total_spent
        FROM Profile p
        JOIN Purchase pr ON p.profile_id = pr.profile_id
        GROUP BY p.profile_id, p.first_name, p.last_name, p.username
        HAVING total_spent > 200
    `;
    executeQuery(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching golden customers:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
