// DB is called gabbleDB
// Table is called Gabs (posts), this will be the child table with the foreign key
// Table is called Users, this is the parent table that the foreign key refers to
// Gabs table has columns: id, userId, text, publishedAt, likes, createdAt, updatedAt
// Users table has columns: id, username, password, createdAt, updatedAt
// likes column is an array of strings

// limit amount of gabs that load on index. Also have link at the bottom that will load more on click.
// when like button on index is clicked, take username from session and push it to Gabs table, likes column.
// delete button appears for gabs that were created by the session's user. If within a for not working as expected. Perhaps try setting a new column in Gabs Table that is a boolean, to determine if the delete button appears or not?
// need to validate fields of sign up page, login page, and new gab page.

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

app.use(expressSession({
  secret: 'gabba dabba do',
  resave: false,
  saveUninitialized: true
}))

app.listen(3000, function(){
  console.log("Gabble is running!")
})

// generates 4 fake gabs
// for (var i = 0; i < 4; i++) {
//   const gab = models.Gabs.build({
//     userId: 4,
//     text: faker.hacker.phrase(),
//     publishedAt: faker.date.past()
//   })
//   gab.save()
// }

app.get('/', function(request, response){
  var passedUsername = request.session.user;
  models.Gabs.findAll({
    order: [
      ['publishedAt', 'DESC']
    ],
    include: [
      {
        model: models.Users,
        as: 'userAlias' // dunno why, but you need this in order to refer to the userId in the mustache file
      }
    ]
  }).then(function(gabs){ // displays all gabs on the home page. May want to change this to findOne to restrict how many gabs it returns, instead of all.
    response.render('index', {
      gabs: gabs,
      sessionUser: passedUsername
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
  var passedUsername = request.session.user;
  response.render('newgab', {
    sessionUser: passedUsername
  });
});

app.get('/logout', function(request, response){
  request.session.user = '';
  response.redirect('/');
})

app.get('/gabdetails/:id', function(request, response){
  var gabDetailsId = request.params.id;
  var passedUsername = request.session.user;
  models.Gabs.findOne({ // displays the gab clicked on by ID
    where: {
      id: gabDetailsId
    },
    include: [
      {
        model: models.Users,
        as: 'userAlias'
      }
    ]
  }).then(function(matchingGab){
    console.log(matchingGab.userAlias.username);
    response.render('gabdetails', {
      text: matchingGab.text,
      publishedAt: matchingGab.publishedAt,
      likes: matchingGab.likes,
      id: gabDetailsId,
      username: matchingGab.userAlias.username,
      sessionUser: passedUsername
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
  request.session.user = loginUsername;
  request.session.password = loginPassword;
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
      request.session.user = loginUsername;
      response.redirect('/');
    }
  })
})

app.post('/newgab', function(request, response){
  var passedUsername = request.session.user;
  models.Users.findOne({ // using the session's username, searches the db for the proper user
    where: {
      username: passedUsername
    }
  }).then(function(gabAuthor){
    const newGab = models.Gabs.build({ // builds a new row in the Gabs Table with the correct gab author!
      userId: gabAuthor.id,
      text: request.body.newGabField,
      publishedAt: moment(),
      likes: []
    })
    newGab.save().then(function(){
      response.redirect('/');
    })
  })
})
