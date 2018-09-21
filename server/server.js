require('./config/config');

const _ = require('lodash');
const express = require('express');
const os = require('os')
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs')

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

// console.log('WHAT', os.platform())

var app = express();

const PORT = process.env.PORT 


app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e)
    });
});
app.get(`/todos/:id`, authenticate, (req, res) => {
    var id = req.params.id
    if(!ObjectID.isValid(`${id}`)) {
        return res.status(404).send()
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
    .then((todo) => {
        if(!todo) {
            return res.status(404).send()
        } 
        res.send({todo})

    }).catch((e) => {
        res.status(400).send()
    })
});
app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id
    if(!ObjectID.isValid(`${id}`)) {
        return res.status(404).send()
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    })
    .then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.status(200).send({todo})
    }).catch((e) => {
        res.status(400).send()
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed'])

    if(!ObjectID.isValid(`${id}`)) {
        return res.status(404).send()
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate(
        {
            _id: id,
            _creator: req.user._id
        }, 
        {$set: body}, {new: true})
        .then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
        }).catch((e) => {
        res.status(400).send()
        });
    });

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me',  authenticate, (req, res) => {
    res.send(req.user)

});

// POST / users / login {email, password}

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    ////////////////// MA METHODE ////////////////
    // var email = req.body.email
    // var password = req.body.password

    // User.findOne({email}).then((login) => {
    //     if(!login ) {
    //         return res.status(404).send('user not found or password didnt match')
    //     }
    //     return login.password
    // }).then((dbpassword => {
    //      return bcrypt.compare(password, dbpassword)
    // })).then((passwordTrueOrFalse) => {
    //     console.log(passwordTrueOrFalse)
    //     if(!passwordTrueOrFalse) {
    //         res.send('MAUVAIS PASSWORD')
    //     }
    //     res.status(200).send(body)
    // }).catch((e) => {
    //     res.status(400).send()
    // });

    ////////////// METHODE FACTORISE /////////////
    User.findByCredentials(body.email, body.password).then((user)=> {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        })
    }).catch((e) => {
        res.status(400).send()
    })
});

// grace a authentificate nous pouvons récupérer les données TOKEN 
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, ()=> {
        res.status(400).send();
    })
})

app.listen(`${PORT}`, () => {
    // console.log(`Started on port ${PORT}`)
});


module.exports = {app};


// var test = http.STATUS_CODES[404]
// console.log(test)

// var url = 'http://google.com'
// var prot = url.substr(url.indexOf('/'))
// console.log(prot)


// var express = require('express')
// var app = express()
// var server = require('http').createServer(app)
// server.listen(2222)
// app.get('/:id(\\d+)', function(req, res) {
//     var id = req.params.id
//     res.status(200).end(`received parameter ${id}`)
//     console.log(id)
// })
