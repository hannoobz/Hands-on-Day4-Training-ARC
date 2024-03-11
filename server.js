const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {  
    try{
        const data = await pool.query('SELECT * FROM movies');
        res.sendStatus(200).send(data.rows);
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

app.post('/', async (req , res) => {
    const {title, year, imdbid, type, poster} = req.body;
    try{
        await pool.query('INSERT INTO movies (Title, Year, imdbID, Type, Poster) VALUES ($1, $2, $3, $4, $5)', [title, year, imdbid, type, poster]);
        res.sendStatus(200).send('Movie added');
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE movies ( Title VARCHAR(255), Year int, imdbID VARCHAR(255) PRIMARY KEY, Type VARCHAR(255), Poster VARCHAR(255) )');
        res.sendStatus(200).send('Successfully created table movie');
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }})
app.listen(port, () => console.log(`Server is running on port ${port}`));