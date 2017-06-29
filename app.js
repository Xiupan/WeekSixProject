//DB is called gabbleDB
//Table is called Gabs
//Gabs table has columns: id, user, text, publishedAt, likes, createdAt, updatedAt
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

// generates 13 fake gabs
// for (var i = 0; i < 13; i++) {
//   const gab = models.Gabs.build({
//     user: faker.internet.userName(),
//     text: faker.hacker.phrase(),
//     publishedAt: faker.date.past(),
//     likes: [faker.internet.userName(), faker.internet.userName(), faker.internet.userName()]
//   })
//   gab.save()
// }

app.get('/', function(request, response){
  models.Gabs.findAll().then(function(gabs){ // displays all gabs on the home page. May want to change this to findOne to restrict how many gabs it returns, instead of all.
    response.render('index', {
      gabs: gabs
    });
  })
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

app.post('/signup', function(request, response){
  var username = request.body.username;
  var password = request.body.password;
  const newUser = models.Users.build({ // inserts a signed up new user into the Users Table
    username: username,
    password: password
  })
  newUser.save().then(function(){
    response.redirect('/');
    console.log('newUser: ' + newUser);
    console.log('models.Users: ' + models.Users);
  })
})
