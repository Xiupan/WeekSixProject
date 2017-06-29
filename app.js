const express = require("express");
const app = express();
const mustache = require("mustache-express");
const models = require("./models");
const faker = require("faker");
const bodyParser = require("body-parser");

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.listen(3000, function(){
  console.log("Gabble is running!")
})

app.get('/', function(request, response){
  response.render('index');
});

app.get('/signup', function(request, response){
  response.render('signup');
});

app.get('/login', function(request, response){
  response.render('login');
});

app.get('/newgab', function(request, response){
  response.render('newgab');
});

app.get('/gabdetails', function(request, response){
  response.render('gabdetails');
});
