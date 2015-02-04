var mongoose = require('mongoose');
var bcyrptjs = require('bcryptjs');
/*
Mongoose Pre-save middleware

functions which are passsed control of flow during execution of document init validate, save and
remove.

*/
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

/**/
var userSchema = new mongoose.Schema({
  email: {type: String, unique: true },
  password: String
});

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err,salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err,hash){
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, function(err,isMatch){
    if (err) return cb(err);
    cb(null,isMatch);
  });
};

var User = mongoose.model('User' , userSchema);
var Show = mongoose.model('Show' ,  showSchema);

mongoose.connect('localhost');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();


app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));

app.get('/api/shows', function(req,res,next){

});


app.listen(app.get('port'), function(){
  console.log('Yo! dropping yo sir-vah at ' + app.get('port'));
});
