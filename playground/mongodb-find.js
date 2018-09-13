const {MongoClient, ObjectID} = require('mongodb')


var url = 'mongodb://localhost:27017/TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to database')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b9a427a3118466266e5e5c8')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })


    // db.collection('Todos').find({
    // }).count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    db
    .collection('Users')
    .find({name: 'lucas'})
    .count()
    .then((count) => {
        console.log(count)
    })

    db
    .collection('Users')
    .find({name: 'lucas'})
    .toArray()
    .then((docs) => {
        console.log(docs)
    })

    // db.close();
})