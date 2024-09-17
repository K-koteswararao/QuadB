const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const app = express();

// PostgreSQL connection setup
const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'crypto_db',
  password: 'your_password',
  port: 5432,
});

// Function to fetch data from WazirX API and store in database
const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    const top10 = Object.values(data).slice(0, 10);

    for (const crypto of top10) {
      const { name, last, buy, sell, volume, base_unit } = crypto;
      await pool.query(
        `INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, last, buy, sell, volume, base_unit]
      );
    }
    console.log('Data stored in the database.');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Fetch and store data when the server starts
fetchCryptoData();

// Route to get data from the database
app.get('/crypto', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crypto_data');
    res.render('index', { data: result.rows });
  } catch (err) {
    res.status(500).send('Error retrieving data');
  }
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
