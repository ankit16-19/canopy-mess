const request = require('request');
const login = require('./login');
const booking = require('/booking');


module.exports = function(app){

  // api prototype
  app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
  })

  // login_test
  app.post('/login',(req,res) => {

    login(req.body, (data) => {
      res.json(data);
    })
  })

  app.post('/booking',(req,res) => {

    booking(req.body, (data) => {
      res.json(data);
    })
  })



};
