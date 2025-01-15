

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./connection.js');

let db;
(async function initializeDbConnection() {
    db = await connectToDatabase();
})();



var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3080;

app.get("/", async (req, res) => {
    try{
        const sql = `SELECT * FROM food`;
        const [rows, fields] = await db.query(sql)
        console.log(rows);
        console.log(fields);
    } catch (err) {
        console.log(err);
    }
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });