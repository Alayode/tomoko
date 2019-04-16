//var session = require('express-session');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var express = require('express');
// var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// var logger = require('morgan');
// var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
// var jwt = require('jwt-simple');
// var moment = require('moment');

// var async = require('async');
// var request = require('request');
// var xml2js = require('xml2js');

// var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
// var sugar = require('sugar');
// var nodemailer = require('nodemailer');
// var _ = require('lodash');
// var User = mongoose.model('User', userSchema);


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

var showSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  genre: [String],
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  status: String,
  poster: String,
  subscribers: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  episodes: [{
      season: Number,
      episodeNumber: Number,
      episodeName: String,
      firstAired: Date,
      overview: String
  }]
});
// Connect to the database
const uri = 'mongodb://ds045511.mlab.com:45511/excalibur';
mongoose.connect(uri, {useNewUrlParser: true});

var app = express();

app.set('port', process.env.PORT || 3000);
// app.use(logger('dev'));

// app.get('/api/shows', function(req, res, next) {
//   var query = Show.find();
//   if (req.query.genre) {
//       query.where({ genre: req.query.genre });
//   } else if (req.query.alphabet) {
//       query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
//   } else {
//       query.limit(12);
//   }
//   query.exec(function(err, shows) {
//       if (err) return next(err);
//       res.send(shows);
//   });
// });


var Show = mongoose.model('Show', showSchema);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});