const {MongoClient, ObjectID} = require('mongodb')


var url = 'mongodb://localhost:27017/TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to database')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat Lunch'})
    // .then((result) => {
    //     console.log(result);
    // });

    // db.collection('Users').deleteMany({name: 'lucas'})
    // .then((result) => {
    //     console.log(result)
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'})
    // .then((result) => {
    //     console.log(result)
    // })

    db.collection('Users').deleteOne({_id: new ObjectID("5b9a54eddfb4bb62e76bf40b")})
    .then((result) => {
        console.log(result)
    })

    // findOneandDelete
    // db.collection('Todos').findOneAndDelete({completed: false})
    // .then((result) => {
    //     console.log(result)
    // })

    // db.close();
})