//DB is called gabbleDB
//Table is called Gabs
//Gabs table has columns: id, user, text, publishedAt, likes, createdAt, updatedAt

// sort gabs on index by publishedAt time
// create a gab page inserts into the gab database. Must also push session user to user column in gab table.
// limit amount of gabs that load on index. Also have link at the bottom that will load more on click.
// when like button on index is clicked, take username from session and push it to gab table, like column.
// delete button appears for gabs that were created by the session's user
// need to format publishedAt time properly. Using moment(), do it client side! In a separate js file that runs client-side.
const express = require("express");
const app = express();
const mustache = require("mustache-express");
const models = require("./models");
const faker = require("faker");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const moment = require("moment");

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
  models.Gabs.findAll({
    order: [
      ['publishedAt', 'DESC']
    ]
  }).then(function(gabs){ // displays all gabs on the home page. May want to change this to findOne to restrict how many gabs it returns, instead of all.
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

app.get('/gabdetails/:id', function(request, response){
  var gabDetailsId = request.params.id;
  models.Gabs.findOne({ // displays the gab clicked on by ID
    where: {
      id: gabDetailsId
    }
  }).then(function(matchingGab){
    response.render('gabdetails', {
      user: matchingGab.user,
      text: matchingGab.text,
      publishedAt: matchingGab.publishedAt,
      likes: matchingGab.likes
    })
  })
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

app.post('/login', function(request, response){
  var loginUsername = request.body.username;
  var loginPassword = request.body.password;
  var loginError = 'Incorrect username or password.'
  models.Users.findOne({
    where: {
      username: loginUsername,
      password: loginPassword
    }
  }).then(function(usersFindOne){
    if (usersFindOne === null) { // displays login error message if login or password do not match Users Table
      response.render('login', {
        error: loginError
      });
    } else if (usersFindOne != null){ // right now it just redirects when a login is successful, but it may need to start a session? Maybe? *shrugs*
      response.redirect('/');
    }
  })
})

// app.post('newgab', function(request, response){ // need to get req.session.user using express-session somehow and then set that equal to 'user' in the Gabs Table
//   var newGabField = request.body.newGabField;
//
// })
