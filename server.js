const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pool = require('./db');
const path = require('path');
const port = 3000
const app = express()
app.use(express.json())


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname,'index.html'))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/movie-data', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM movies')
        res.status(200).json(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.get('/setup', async (req, res) => {
    const data = fs.readFileSync('movies.json', 'utf8');
    const movies = JSON.parse(data);
    console.log(movies);
    try {
        await pool.query('CREATE TABLE movies( Title VARCHAR(255), Year VARCHAR(255), imdbID VARCHAR(255), Type VARCHAR(255), Poster VARCHAR(255))')
        for (let movie of movies) {
            const { Title, Year, imdbID, Type, Poster } = movie;
            await pool.query('INSERT INTO movies (Title, Year, imdbID, Type, Poster) VALUES ($1, $2, $3, $4, $5)', [Title, Year, imdbID, Type, Poster]);
        }
        res.status(200).send({ message: "Successfully added movie" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.post('/', async (req, res) => {
    const movies = req.body
    try {
        for (let movie of movies) {
            const { Title, Year, imdbID, Type, Poster } = movie;
            await pool.query('INSERT INTO movies (Title, Year, imdbID, Type, Poster) VALUES ($1, $2, $3, $4, $5)', [Title, Year, imdbID, Type, Poster]);
        }
        res.status(200).send({ message: "Successfully added movie" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/submit', async (req, res) => {
    const { title, year, imdbID, type, poster } = req.body;
    console.log('submitted',title,year,imdbID,type,poster)
    try {
        await pool.query('INSERT INTO movies (Title, Year, imdbID, Type, Poster) VALUES ($1, $2, $3, $4, $5)', [title, year, imdbID, type, poster]);
        res.status(200).send({ message: "Successfully added movie" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/delete', async (req, res) => {
    const { imdbID } = req.body;
    try {
        await pool.query('DELETE FROM movies WHERE imdbID = $1', [imdbID]);
        res.status(200).send({ message: "Successfully deleted movie" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


app.listen(port, () => console.log(`Server has started on port: ${port}`))
