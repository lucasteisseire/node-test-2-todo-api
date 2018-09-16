const {ObjectID} = require('mongodb')

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user')

// Todo.deleteMany({}).then((result) => {
//     console.log(result)
// })

Todo.findOneAndRemove({_id: '5b9b77c9b332e4221313edd5'}).then((todo) => {
    console.log(todo)
})

Todo.findByIdAndRemove('5b9b77c9b332e4221313edd5').then((todo) => {
    console.log(todo)
})