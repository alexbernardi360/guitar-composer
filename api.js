var express         = require('express');
var bodyParser      = require('body-parser');
var pg              = require('pg');
var parse_cs        = require('pg-connection-string').parse;
var validator       = require('validator');

// db connection
var config          = parse_cs(process.env.DATABASE_URL);
var pool            = new pg.Pool(config);

var app             = express();

// use some express packages
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const listener = app.listen(process.env.PORT, function() {
    console.log('The server is listening on port: ' + listener.address().port);
});

// ROOT PAGE
app.get('/', function(request, response) {
    response.status(200).send("Work in progress.");
})

/********************************/
/*        API ENDPOINTS         */
/********************************/

// Register in the API.
app.post('/api/join', async function(request, response) {
    var username        = request.body.username.split("'").join("`");;
    var password        = request.body.password.split("'").join("`");;

    if (!(await validateUsername(username)))
        response.status(422).send('Username not available.');
    else if (!validatePassword(password))
        response.status(422).send('Wrong password format.');
    else {
        var queryString = 'INSERT INTO public."Users" (username, password) ' +
                          'VALUES (\'' + username + '\', \'' + password +'\')';       
        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log('New account created: ' + username);
                response.status(200).send(username + ', registration successful.');
            }
        });
    }
});

// Delete account in the API. 
app.delete('/api/deleteAccount', function (request, response) {
    var username        = request.body.username.split("'").join("`");;
    var password        = request.body.password.split("'").join("`");;

    var queryString     = 'DELETE FROM public."Users" WHERE username=\'' +
                          username + '\' AND password=\'' + password + '\'';

    pool.query(queryString, function(error, result) {
        if (error) {
            console.log(error);
            response.status(400).send(error);
        } else 
            if (result.rowCount > 0) {
                console.log(username + " deleted.");
                response.status(200).send(username + ' deleted.');
            }
            else {
                console.log(request.ip + ' tried to delete the account: ' + username);
                response.status(401).send('Authentication Failed: invalid username and/or password.');
            }
    });
})

// Add a new song in the API.
app.post('/api/addSong', async function(request, response) {
    var title            = request.body.title.split("'").join("`");
    var artist          = request.body.artist.split("'").join("`");
    var tuning          = request.body.tuning.split("'").join("`");
    var capo            = request.body.capo.split("'").join("`");
    var note            = request.body.note.split("'").join("`");
    var content         = request.body.content.split("'").join("`");

    var username        = request.body.username;
    var password        = request.body.password;

    if (!await validateAuth(username, password))
        response.status(401).send('Authentication Failed: invalid username and/or password.');
    else if (!await validateName(title))
        response.status(403).send('The song already exists.');
    else { 
        var queryString = 'INSERT INTO public."Songs" ' + 
                          '(title, username_fk, artist, tuning, capo, note, content) VALUES (\'' + 
                          [title, username, artist, tuning, capo, note, content].join('\',\'') + '\')';

        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log(username + " added: " + title + " by " + artist);
                response.status(200).send('Song successfully added.');
            }
        });
    }
});

/****************************/
/*        FUNCTIONS         */
/****************************/

async function validateName(title) {
    var queryString = 'SELECT * FROM public."Songs" WHERE title=\'' + title + '\'';

    try {
        var result = await pool.query(queryString);
        if (result.rowCount == 0 && title.length > 0 && title.length <= 256) {
            return true;
        } else {
            return false;
        }
    } catch (error) {}
}

async function validateAuth(username, password) {
    var queryString = 'SELECT * FROM public."Users" WHERE username=\'' + username + '\' AND password=\'' + password + '\'';

    try {
        var result = await pool.query(queryString);
        if (result.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {}
}

async function validateUsername(username) {
    var queryString = 'SELECT * FROM public."Users" WHERE username=\'' + username + '\'';

    if (!validator.matches(username, '^[a-zA-Z0-9_\.\-]{5,20}$')) {
        return false;
    } else {
        try {
            var result = await pool.query(queryString);
            if (result.rowCount == 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {}
    }
}

function validatePassword(password) {
    return validator.matches(password, '[A-Za-z\d@$.!%*#?&]{6,256}');
}
