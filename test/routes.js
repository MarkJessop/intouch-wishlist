var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config/database');
var User = require('../models/user');
var Item = require('../models/item');
var Card = require('../models/card');



describe('Routing', function() {
    before(function(done){
        mongoose.connect(config.testUrl);
        User.create({
            name: 'Test User',
            email: 'test@test.com',
            address: '123 fake st',
            city: "Ottawa",
            province: 'Ontario',
            country: 'Canada',
            postal_code: 'A1B 2C3',
            username: 'testuser',
            cards: [{
                number: '4242424242424242',
                exp_month: 12,
                exp_year: 2014,
                cvc : 113,
                name: 'Mark Jessop'
            }]
        });
        done();
    })

    after(function(done){
        User.remove({}, function(err){
            if (err)
                throw err;
            console.log('All users deleted')
        })
        done();
    })

    var url = 'http://localhost:3000';


    describe('Users', function() {

        it('should successfully get a user\'s information', function(done){
            var username = 'testuser';
            request(url)
                .get('/user/' + username)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should successfully update the user', function (done) {

            var user = {
                name: 'Test User Revised',
                email: 'test@test.com',
                address: '123 fake st',
                city: "Ottawa",
                province: 'Ontario',
                country: 'Canada',
                postal_code: 'A1B 2C3',
                username: 'testuser'
            };

            request(url)
                .put('/user/' + user.username)
                .send({user: user})
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('status', 200);
                    res.body.should.have.property('name', 'Test User Revised');
                    done();
                });
        });

        it('should return a user not found error when trying to update', function (done) {

            var user = {
                name: 'Bad User',
                email: 'test@test.com',
                address: '123 fake st',
                city: "Ottawa",
                province: 'Ontario',
                country: 'Canada',
                postal_code: 'A1B 2C3',
                username: 'baduser'
            };

            request(url)
                .put('/user/' + user.username)
                .send(user)
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('status', 500);
                    done();
                });
        });

    });

    describe('Card', function() {
        var newCard = {
            number: '4012888888881881',
            exp_month: 12,
            exp_year: 2014,
            cvc : 113,
            name: 'Mark Jessop'
        }

        it('should successfully update the card', function (done) {

            var username = 'testuser';
            request(url)
                .post('/user/' + username + '/card')
                .send(newCard)
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('status', 200);
                    done();
                });
        });

        it('should return a user not found error when trying to update', function (done) {

            var username = 'baduser';
            request(url)
                .post('/user/' + username + '/card')
                .send(newCard)
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                // end handles the response
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('status', 500);
                    done();
                });
        });

    });

    describe('Items', function() {
        var username = 'testuser';

        it('should return a list of items', function(done){
           request(url)
               .get('/user/' + username + '/items')
               .send()
               .end(function (err, res) {
                   if (err) {
                       throw err;
                   }

                   res.should.have.property('status', 200);
                   done();
               });
        });
        it('should add a new item to the user\'s item list', function(done){
            var item = {
                price: 30,
                amazon_id: "B00B6JKRSY"
            };
           request(url)
               .post('/user/' + username + '/items')
               .send(item)
               .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
               .end(function (err, res) {
                   if (err) {
                       throw err;
                   }

                   res.should.have.property('status', 200);
                   res.body.current_price.should.be.above(0); //tests if update from amazon price worked
                   done();
               });
        });

        it('should cause an error when adding an item with a bad ASIN', function(done){
            var item = {
                price: 30,
                amazon_id: "B00B6JK"
            };
            request(url)
                .post('/user/' + username + '/items')
                .send(item)
                .set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }

                    res.should.have.property('status', 500);
                    User.findOne({'username': username, 'items.amazon_id' : item.amazon_id }, function(err, user){
                        (user === null).should.be.true;
                    });
                    done();
                });
        });


        it('should buy an item', function(done){
            request(url)
                .get('/user/' + username + '/items')
                .send()
                .end(function (err, res){
                    var item_id = res.body[0]._id

                    request(url)
                        .get('/user/' + username + '/items/' + item_id + '/buy')
                        .send()
                        .end(function (err, res){
                           res.should.have.property('status', 200);
                            done();
                        });
                });
        });

        it('should delete an item', function(done){
            request(url)
                .get('/user/' + username + '/items')
                .send()
                .end(function (err, res){
                    request(url)
                        .delete('/user/' + username + '/items/' + res.body[0]._id)
                        .send()
                        .end(function(error, response){
                            response.should.have.property('status', 200);
                            done();
                        });
                });
        });
        it('should return an item not found error when deleting', function(done){
            request(url)
                .delete('/user/' + username + '/items/bad-item-id')
                .send()
                .end(function(err, res){
                    res.should.have.property('status', 500);
                    done();
                })
        });

    });
});