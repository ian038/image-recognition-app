const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const app = express();

app.use(cors())
app.use(express.json()); 

app.listen(5000, ()=> {
    console.log('app running on port 5000');
})