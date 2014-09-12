var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    conf = require('./configuration'),
    upload = require('jquery-file-upload-middleware');

var MongoClient = require('mongodb').MongoClient;
var rest = require('gleaner-data').rest;

var app = express();

app.use(cookieParser());
app.use(session({
    secret: conf.sessionSecret
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var options = {
    apiRoot: '/api/',
    collectorRoot: '/collect/',
    passwordsSalt: conf.passwordsSalt,
    loginPath: '/login',
    redirectLogin: '/app'
};

/*app.all('*', function(req, res, next) {
    setTimeout(next, 500);
});*/

app.get('/', function(req, res) {
    res.redirect(options.redirectLogin);
});

app.get(options.loginPath, function(req, res) {
    if (req.session.role) {
        res.redirect(options.redirectLogin);
    } else {
        res.render('login', {
            error: req.query.error
        });
    }
});

var redirect = function(req, res, next) {
    if (req.session.role) {
        next();
    } else {
        res.redirect(options.loginPath);
    }
};

app.all(options.apiRoot + '*', redirect);
app.all(options.redirectLogin + '*', redirect);

app.get(options.redirectLogin, function(req, res) {
    res.render('index');
});

app.get(options.redirectLogin + '/home', function(req, res) {
    res.render('home');
});

app.get(options.redirectLogin + '/data', function(req, res) {
    res.render('data');
});

app.get(options.redirectLogin + '/realtime', function(req, res) {
    res.render('realtime');
});

app.get(options.redirectLogin + '/reports', function(req, res) {
    res.render('reports');
});

app.get(options.redirectLogin + '/activity', function(req, res) {
    res.render('activity');
});

app.get('/logout', function(req, res) {
    delete req.session.role;
    delete req.session.name;
    res.render('login');
});

// Uploads

upload.configure({
    uploadDir: process.cwd() + '/uploads',
    uploadUrl: '/app/uploads'
});

app.use('/app/upload', upload.fileHandler());

// EAd Analyzer
var eadAnalyzer = require('./lib/ead-analyzer');
app.post('/app/extractdata', eadAnalyzer.processReq);

// Start analysis
app.post('/api/analyze/:versionId', require('./lib/version-analysis').analyze);


var fs = require('fs');

app.get('/app/uploads/*', function(req, res) {
    var file = process.cwd() + '/uploads/' + req.params[0];
    fs.exists(file, function(exists) {
        if (exists) {
            fs.readFile(file, function(err, img) {
                if (err) {
                    res.send(500);
                } else {
                    var re = /(?:\.([^.]+))?$/;
                    var extension = re.exec(file)[1];
                    res.writeHead(200, {
                        'Content-Type': 'image/' + extension
                    });
                    res.end(img, 'binary');
                }
            });
        } else {
            res.send(404);
        }
    });
});

MongoClient.connect('mongodb://127.0.0.1:27017/gleaner', function(err, db) {
    if (err) {
        console.log(err);
    } else {
        rest(db, app, options);
        app.all('*', function(req, res) {
            res.redirect(options.redirectLogin);
        });
        app.listen(3000, function() {
            console.log('Listening in 3000');
        });
    }
});