const express = require('express');
const routes = require('./routes');
const path = require('path');

const mongoose = require('mongoose');
const passport = require('passport');

require('./models/user');
require('./passport')(passport)


mongoose.connect('mongodb://localhost:27017/db28', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', (err) => {
    if (err) throw err;
    console.log('Connected to db!');
});

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: 'lollllo' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

app.listen(app.get('port'), function() {
    console.log('Loading on ' + app.get('port'));
});