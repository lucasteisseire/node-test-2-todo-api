const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user')

var todoID = '5b9ab69d8971487fd5ba53e1'
if(!ObjectID.isValid(todoID)) {
    console.log('ID not valid')
}
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo) 
// })

Todo.findById(todoID)
.then((todo) => {
    if (!todo) {
        return console.log('Id not found')
    }
      console.log('Todo by id', todo)
}).catch((e) => {
})

User.findById("5b9a9f3b2864e9709d6b09d3")
.then((user) => {
    if (!user) {
        return console.log('User not found', user)
    }
    console.log('user by id', user)
}).catch((e) => {
    console.log(e)
})


