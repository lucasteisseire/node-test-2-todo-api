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


    db.collection('Users').find(({ name: 'Béatrice'}))
    .toArray()
    .then((username) => {
        // console.log(username)
    })

    //affiche seulement le fields name
    db.collection('Users')
    .aggregate( [ 
        { $project : { name : 1 } }, 
        { $match : { name : "Béatrice" } }
    ] )

    .toArray()
    .then((username) => {
        //  console.log('VOTRE PRENOM', username)
    })

    // affiche le nombre de salariés en informatique
    db.collection('Users')
    .find({job: "Informatique"})
    .count()
    .then((count) => {
        // console.log(count)
    })

    // Affiche tous les différents jobs
    db.collection('Users')
    .distinct( "job" )
    .then((jobs) => {
    //  console.log(jobs)
    })

    //affiche le salaire max 
    db
    .collection('Users')
    .find()
    .sort( { salaire: -1 } )
    .limit(1)
    .toArray()
    .then((result) => {
        //  console.log(result)
    })

    //affiche seulement le prénom de la personne qui gagne le salaire max 
    db
    .collection('Users')
    .find()
    .sort( { salaire: -1 } )
    .limit(1)
    .toArray()
    .then((result) => {
        //  console.log(result)
    })

    //total des salaires informatiques 
    db
    .collection('Users')
    .aggregate([{
        $match: {job: "Informatique"},

    }, {
        $group:{
            _id: "$id",
            sumSalaire : {$sum: "$salaire"}
       } 
    }
    ])
    .toArray()
    .then((result) => {
         console.log("salaire ",result)
    })


    // moyenne des salaires des employés 
    // db
    // .collection('Users')
    // .aggregate([{
    //     $group: {job: "$job", },

    // }, {
    //     avgSalaire: { $avg: "$salaire" }
    // }

    // ])
    // .toArray()
    // .then((result) => {
    //     console/log(result)
    // })
  // Afficher tous les employés, excepté ceux du service production et secrétariat
    db.collection('Users').find( { $and: [ { $or : [ { job : "Surveillant" }, { job: "Informatique" } ] },
    ] } )
    .toArray()
    .then((res) => {
        // console.log('allo',res)
    })


    db
    .collection('Users')
    .find()
    .count()
    .then((count) => {
        //  console.log(count)
     })

    db
    .collection('Users')
    .find({name: 'lucas'})
    .toArray()
    .then((docs) => {
        // console.log(docs)
    })

    db
    .collection('Users')
    .find()
    .toArray()
    .then((users) => {
        // console.log(users)
    })
    // db.close();
    db
    .collection('Users')
    .find()
    .sort( { name: -1 } ).limit( 2 )
    .toArray()
    .then((result) => {
        // console.log(result)
    })

    db
    .collection('Users')
    .find()
    .limit( 3 )
    .sort( { name: -1 } )
    .toArray()
    .then((result) => {
        // console.log(result)
    })

    db.collection('Users')
    .find({ "name": { "$exists": true } })
    .sort({'name': 1})
    .toArray()
    .then((result) => {
        // console.log(result)
    })


})