const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const auth = require('./controllers/auth');
const image = require('./controllers/image');

const app = express();

app.use(cors())
app.use(express.json()); 

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'ian',
      password : 'Angie1028',
      database : 'smart-brain'
    }
});

app.post('/signin', auth.signIn(db, bcrypt))
  
app.post('/register', (req, res) => { auth.register(req, res, db, bcrypt) })
  
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.listen(8000, ()=> {
    console.log('app running on port 8000');
})