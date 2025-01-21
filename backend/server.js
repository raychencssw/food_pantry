

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToDatabase = require('./connection.js');


//call the connectToDatabase here to get the promise "db"
let db;
(async function initializeDbConnection() {
    db = await connectToDatabase();
})();



var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials if needed
}));

const port = process.env.PORT || 3080;

app.get("/", async (req, res) => {
    try{
        const sql = `SELECT * FROM food`;
        const [rows, fields] = await db.query(sql);
        console.log(rows);
        // console.log(fields);
        console.log("sent data back to frontend!");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/add-item", async (req, res) => {
    //step1: query the item being added
    //step2: if it doesn't exist yet, add it to thd DB; if it does, increment the quantity
    
    const { Item } = req.body;
    try{
        const sql = `SELECT * FROM food where Item = ?`;
        const value = Item;
        const [rows, fields] = await db.query(sql, value);
        //console.log(rows);
        
        if (rows.length > 0) {
            const sql = `UPDATE food SET Amount = Amount + 1 WHERE Item = ?`;
            const value = Item;
            await db.query(sql, value);
            console.log("incremented " + Item + " by 1!" );
        }
        else{
            console.log("item hasn't existed yet...");
            const sql = `Insert into food (ID, Item, Category, Amount) VALUES (?, ?, ?, ?)`;
            const value = [5, Item, 'Fruit', 1];
            await db.query(sql, value);
            console.log("created a new item!");
        }
        console.log("sent data back to frontend!");
        res.json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/remove-item", async (req, res) => {
    //step1: query the item being added and check its amount
    //step2: if the amount after removal becomes 0, delete the row in MySQL DB; if not, just decrement the amount
    const { Item } = req.body;

    try{
        const sql = `SELECT amount FROM food where Item = ?`;
        const value = Item;
        const [rows, fields] = await db.query(sql, value);
        console.log("Deleting " + Item + " from DB...");
        console.log(rows);
        const amount = rows.length > 0 ? rows[0].amount : null;
        console.log(amount);
        if (amount > 1){
            const sql = `UPDATE food SET Amount = Amount - 1 WHERE Item = ?`;
            const value = Item;
            await db.query(sql, value);
            console.log("Decremented " + Item + " by 1.");
        }
        else{
            const sql = 'DELETE FROM food WHERE Item = ?';
            const value = Item;
            await db.query(sql, value);
            console.log("Deleted " + Item + ".");
        }
        console.log("sent data back to frontend!");
        res.json(Item);
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });