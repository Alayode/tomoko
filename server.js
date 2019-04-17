//var session = require('express-session');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
// var logger = require('morgan');
// var crypto = require('crypto');

// var jwt = require('jwt-simple');
// var moment = require('moment');

// var async = require('async');
// var request = require('request');
// var xml2js = require('xml2js');

// var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
// var sugar = require('sugar');
// var nodemailer = require('nodemailer');
// var _ = require('lodash');

//  Deprecated since mongoose handles it natively
// var bodyParser = require('body-parser');

var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
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
mongoose.Promise = global.Promise;
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
const uri = 'mongodb://excalibur:uevol1101@ds045511.mlab.com:45511/excalibur';
mongoose.connect(uri, { useMongoClient: true });


// 
var backEndApp = express();

backEndApp.set('port', process.env.PORT || 3000);
// backEndApp.use(logger('dev'));

backEndApp.get('/api/shows', function (req, res, next) {
    var query = Show.find();
    console.log(query)
    if (req.query.genre) {
        query.where({ genre: req.query.genre });
    } else if (req.query.alphabet) {
        query.where({ name: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
        query.limit(12);
    }
    query.exec(function (err, shows) {
        if (err) return next(err);
        res.send(shows);
    });
});
// Grab One Show by Id
backEndApp.get('/api/shows/:id', function (req, res, next) {
    Show.findById(req.params.id, function (err, show) {
        if (err) return next(err);
        res.send(show);
    });
});

// Grab all the shows
backEndApp.post('/api/shows', function (req, res, next) {
    var seriesName = req.body.showName
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/[^\w-]+/g, '');
    var secretAPIKey = 'TB7L70RHZEKT1L8T'; // This is my unique API Key
    var parser = xml2js.Parser({
        explicitArray: false,
        normalizeTags: true
    });

    async.waterfall([
        function (callback) {
            request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function (err, result) {
                    if (!result.data.series) {
                        return res.send(400, { message: req.body.showName + ' was not found.' });
                    }
                    var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
                    callback(err, seriesId);
                });
            });
        },
        function (seriesId, callback) {
            request.get('http://thetvdb.com/api/' + secretAPIKey + '/series/' + seriesId + '/all/en.xml', function (error, response, body) {
                if (error) return next(error);
                parser.parseString(body, function (err, result) {
                    var series = result.data.series;
                    var episodes = result.data.episode;
                    var show = new Show({
                        _id: series.id,
                        name: series.seriesname,
                        airsDayOfWeek: series.airs_dayofweek,
                        airsTime: series.airs_time,
                        firstAired: series.firstaired,
                        genre: series.genre.split('|').filter(Boolean),
                        network: series.network,
                        overview: series.overview,
                        rating: series.rating,
                        ratingCount: series.ratingcount,
                        runtime: series.runtime,
                        status: series.status,
                        poster: series.poster,
                        episodes: []
                    });
                    _.each(episodes, function (episode) {
                        show.episodes.push({
                            season: episode.seasonnumber,
                            episodeNumber: episode.episodenumber,
                            episodeName: episode.episodename,
                            firstAired: episode.firstaired,
                            overview: episode.overview
                        });
                    });
                    callback(err, show);
                });
            });
        },
        function (show, callback) {
            var url = 'http://thetvdb.com/banners/' + show.poster;
            request({ url: url, encoding: null }, function (error, response, body) {
                show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
                callback(error, show);
            });
        }
    ], function (err, show) {
        if (err) return next(err);
        show.save(function (err) {
            if (err) {
                if (err.code == 11000) {
                    return res.send(409, { message: show.name + ' already exists.' });
                }
                return next(err);
            }
            var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2 });
            agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');
            res.send(200);
        });
    });
});

// Handle Error Below
backEndApp.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

// This will be used at the end of your routes
// Whenever a Error occurs a stack trace is output
// in the console and JSON response is returned
// with the error message.

backEndApp.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

// Authentication

function ensureAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        try {
            var decoded = jwt.decode(token, tokenSecret);
            if (decoded.exp <= Date.now()) {
                res.send(400, 'Access token has expired');
            } else {
                req.user = decoded.user;
                return next();
            }
        } catch (err) {
            return res.send(500, 'Error parsing token');
        }
    } else {
        return res.send(401);
    }
}

function createJwtToken(user) {
    var payload = {
        user: user,
        iat: new Date().getTime(),
        exp: moment().add('days', 7).valueOf()
    };
    return jwt.encode(payload, tokenSecret);
}

backEndApp.post('/auth/signup', function(req, res, next) {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if (err) return next(err);
        res.send(200);
    });
});

backEndApp.post('/auth/login', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.send(401, 'User does not exist');
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) return res.send(401, 'Invalid email and/or password');
            var token = createJwtToken(user);
            res.send({ token: token });
        });
    });
});



// Listen for port on express server
var Show = mongoose.model('Show', showSchema);
backEndApp.use(cookieParser());
backEndApp.use(express.static(path.join(__dirname, 'public')));

backEndApp.listen(backEndApp.get('port'), function () {
    console.log('Express server listening on port ' + backEndApp.get('port'));
});