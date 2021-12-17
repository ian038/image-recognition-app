const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const auth = require('./controllers/auth');
const image = require('./controllers/image');

const app = express();
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json()); 

const db = knex({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    }
});

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.post('/signin', auth.signIn(db, bcrypt))
  
app.post('/register', (req, res) => { auth.register(req, res, db, bcrypt) })
  
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))