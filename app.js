
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongoose = require("mongoose");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// database configure - 1 (Article form)
mongoose.connect('mongodb://localhost/company');
var Schema1 = new mongoose.Schema({
	_id: String,
	content: String
});
var user1 = mongoose.model("articles", Schema1);
// database configure - 2 (registration form)
var Schema2 = new mongoose.Schema({
	_id: String,
	firstname: String,
	lastname: String,
	age: Number,
	username: String,
	password: String
});
var user2 = mongoose.model('registers', Schema2);

// view one article
app.get('/user/:id', function(req, res) {
	user.find({_id: req.params.id}, function(err, docs) {
		if(err) res.json(err);
		else res.render('show', {user: docs[0]})
	});
});

// view all articles
app.get('/', function(req, res) {
	user1.find({}, function(err, docs) {
		if(err) res.json(err);
		else res.render('index', {users: docs});
	});
});

// registration completed
app.get('/register', function(req, res) {
	res.render('registration-form');
});

app.post('/doneReg', function(req, res) {
	if (req.body.password1 === req.body.password2){
		var password = req.body.password1
	}
	else {
		res.redirect('/register');
	}
	new user2({
		_id: req.body.email,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		age: req.body.age,
		username: req.body.username,
		password: password
	}).save(function(err, docs) {
		if(err) res.json(err);
		else res.send("Registration sucessful !!!");
	});
});

// login verification
app.get('/login', function(req, res) {
	res.render('login-form');
});

app.post('/verify', function(req, res) {
	user2.find({_id: req.body.email, password: req.body.password}, function(err, docs) {
		if (docs[0]._id == req.body.email && docs[0].password == req.body.password) {
			res.redirect('/');
		}
		else {
			res.redirect('/login');
		}
	});
});

// article creation
app.get('/create', function(req, res) {
	res.render("create-form");
});

app.post('/new', function(req, res) {
	new user1({
		_id: req.body.title,
		content: req.body.content
	}).save(function(err, docs) {
		if(err) res.json(err);
		else res.send("Data entered");
	});
});

app.get('/', function(req, res) {
	res.render('index');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
