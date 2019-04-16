//var session = require('express-session');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// var logger = require('morgan');
// var crypto = require('crypto');
// var bcrypt = require('bcryptjs');
// var mongoose = require('mongoose');
// var jwt = require('jwt-simple');
// var moment = require('moment');

// var async = require('async');
// var request = require('request');
// var xml2js = require('xml2js');

// var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
// var sugar = require('sugar');
// var nodemailer = require('nodemailer');
// var _ = require('lodash');


// var userSchema = new mongoose.Schema({
//   email: { type: String, unique: true, lowercase: true, trim: true },
//   password: String,
// });

// userSchema.pre('save', function(next) {
//     var user = this;
//     if (!user.isModified('password')) return next();
//     bcrypt.genSalt(10, function(err, salt) {
//         if (err) return next(err);
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             user.password = hash;
//             next();
//         });
//     });
// });

// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//       if (err) return cb(err);
//       cb(null, isMatch);
//   });
// };

// Connect to the database
// mongoose.connect('mongodb://azuramei:uevol11@ds045511.mlab.com:45511/excalibur');

var app = express();

app.set('port', process.env.PORT || 3000);
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});