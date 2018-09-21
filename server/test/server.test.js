const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err) {
                return done(err)
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e))
        })
    });

    it('should not create todo with invalide body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2)
                done()
            }).catch((e) => done(e))
        })

    })
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1)
        })
        .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    });

    it('Should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })



    it('should return a 404 if todo not found', (done) => {
        var hexId =  new ObjectID().toHexString()
        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/aaaaaa`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist()
            }).catch((e) => {
                return done(err)
            })
        })
    })

    it('should remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toExist()
            }).catch((e) => {
                return done(err)
            })
        })
    })


    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`/todos/123abc`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
     });
});

describe("PATCH /todos/:id", () => {
    it('should  update the todo', (done) => {
        var hexId = todos[0]._id.toHexString()
        var text = 'testolaquetal'
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
       .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res) => {
            console.log(res.body.todo.completedAt)
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number')
        })
        .end(done);

    }),

    it('should  not update the todo', (done) => {
        var hexId = todos[0]._id.toHexString()
        var text = 'testolaquetal'
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
       .send({
            completed: true,
            text
        })
        .expect(404)
        .end(done);

    }),

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString()
        var text = 'testolaquetal'
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            completed: false,
            text
        })
        .expect((res) => {
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy()
        })
        .end(done)

    }) 
    
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done)

    });
});

describe('POST /users', () => {
    it('should create a user', (done)=> {
        var email = 'exemple@exemple.com';
        var password = '123ERT!'

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy()
            expect(res.body.email).toBe(email)
        })
        .end((err) => {
            if(err) {
                return done(err)
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toEqual(password);
                done();
            });
        });
    });

     it('should return validation errors if request invalid', (done)=> {
        var email = 'leuaksd';
        var password= '1';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)
     });

     it('should not create user if email in use', (done)=> {
        var email = users[0].email;
        var password = 'testonsle';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done)        
     });
    
})

describe('POST /users/login', () => {

    it('should log you and return auth token', (done) => {
        var email = users[1].email
        var password = users[1].password
        request(app)
        .post('/users/login')
        .send({
            email, 
            password
        })
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toBeTruthy()
        })
        .end((err, res) => {
            if(err) { 
                return done(err)
            }        

        User.findById(users[1]._id).then((user) => {
            console.log('U S E R', user)
            console.log('T O K E N',user.tokens[1])
            console.log('U S E R T O K E N', user.tokens[0])
            expect(user.tokens[1]).toMatchObject({
                access: 'auth',
                token: res.headers['x-auth'],
            })
            done();
        }).catch((e) => done(e))
    });
})

    it('Should return invalid login', (done) => {
        
        request(app)
        .post('/users/login')
        .send(({
            email: users[1].email,    
            password: users[1].password + "1"
        }))
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBe(undefined)
        })
        .end((err, res) => {
            if(err) {
                done(err)
            }
        })
        User.findOne(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(1)
            done()
        }).catch((e) => done(e))
        
    })

});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        var token = users[0].tokens[0].token
        var email = users[0].email
        request(app)
        .delete('/users/me/token')
        .set('x-auth', token)
        .expect(200)
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            User.findOne({email}).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();

            }).catch((e) => done(e))

        })        
})
});
