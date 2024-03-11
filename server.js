const express = require('express')
const pool = require('./db')
const port = 3000

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM movies')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    const { Title, Year, imdbID, Type, Poster } = req.body
    try {
        await pool.query('INSERT INTO movies (Title, Year, imdbID, Type, Poster) VALUES ($1, $2, $3, $4, $5)', [Title, Year, imdbID, Type, Poster])
        res.status(200).send({ message: "Successfully added Titles" })
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE movies( Title VARCHAR(255), Year INT, imdbID VARCHAR(255), Type VARCHAR(255), Poster VARCHAR(255))')
        res.status(200).send({ message: "Successfully created table" })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.listen(port, () => console.log(`Server has started on port: ${port}`))