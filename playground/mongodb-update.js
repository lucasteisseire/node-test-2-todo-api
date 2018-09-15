const {MongoClient, ObjectID} = require('mongodb')


var url = 'mongodb://localhost:27017/TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return console.log('Unable to connect to database')
    }
    console.log('Connected to MongoDB server')
    const db = client.db('TodoApp')

    db.collection('Todos').findOneAndUpdate({
        _id : ObjectID("5b9a5914b332e422131354ca"),
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    })

    db.collection('Users').findOneAndUpdate({
        _id: ObjectID("5b9a56599acfd362fc9c09ae")
    }, {
       $set: {
           name: 'lucas'
       },
       $inc: {
           age: 1 
       }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(JSON.stringify(result))
    }
    )
    // db.close();
})