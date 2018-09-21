const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


const users = [{
    _id: userOneId,
    email: 'lucas@lucas.fr',
    password: 'userpass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'dgyhqzioudvazyd').toString()
    }]
}, {
    _id: userTwoId,
    email: 'userpass@test.fr',
    password: 'usertwopass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'dgyhqzioudvazyd').toString()
    }]


}]

const todos = [{
    _id: new ObjectID(),
    text: 'first test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done)=> {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
};

const populateUsers = (done)=> {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

       return  Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = {
    todos,
    users,
    populateTodos,
    populateUsers
}
