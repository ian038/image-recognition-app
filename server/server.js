const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex')

const app = express();

app.use(cors())
app.use(express.json()); 

// test data
const db = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john117@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res)=> {
    res.send(db.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
    }).catch(err => res.status(400).json('wrong credentials'))
})
  
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false
    db.users.forEach(user => {
        if(user.id === id) {
            found = true
            return res.status(200).json(user)
        }
    })
    if(!found) {
        res.status(404).json('No such user')
    }
    // db.select('*').from('users').where({id})
    //   .then(user => {
    //     if (user.length) {
    //       res.json(user[0])
    //     } else {
    //       res.status(400).json('Not found')
    //     }
    // }).catch(err => res.status(400).json('error getting user'))
})
  
app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false
    db.users.forEach(user => {
        if(user.id === id) {
            found = true
            user.entries += 1
            return res.status(200).json(user.entries)
        }
    })
    if(!found) {
        res.status(404).json('No such user')
    }
    // db('users').where('id', '=', id)
    // .increment('entries', 1)
    // .returning('entries')
    // .then(entries => {
    //   res.json(entries[0]);
    // }).catch(err => res.status(400).json('unable to get entries'))
})

app.listen(5000, ()=> {
    console.log('app running on port 5000');
})