var express         = require('express');
var bodyParser      = require('body-parser');
var pg              = require('pg');
var parse_cs        = require('pg-connection-string').parse;
var https           = require('https');

// db connection
var config          = parse_cs(process.env.DATABASE_URL);
var pool            = new pg.Pool(config);

var app             = express();

// use some express packages
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const listener = app.listen(process.env.PORT, function() {
    console.log(`The server is listening on port: ${listener.address().port}`);
});

// ROOT PAGE
app.get('/', function(request, response) {
    response.status(200).send(`Work in progress.`);
})

/********************************/
/*        API ENDPOINTS         */
/********************************/

// Register in the API.
app.post('/api/join', async function(request, response) {
    var username        = request.body.username.split("'").join("`");
    var password        = request.body.password.split("'").join("`");

    if (!await validateUsername(username))
        response.status(422).send(`Username not available.`);
    else if (!validatePassword(password))
        response.status(422).send(`Wrong password format.`);
    else {
        var queryString = `INSERT INTO public."Users" (username, password) ` +
                          `VALUES ('${username}', '${password}')`;       
        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log(`New account created: ` + username);
                response.status(200).send(`${username}, registration successful.`);
            }
        });
    }
});

// Delete account in the API. 
app.delete('/api/deleteAccount', function (request, response) {
    var username        = request.body.username.split("'").join("`");;
    var password        = request.body.password.split("'").join("`");;

    var queryString     = `DELETE FROM public."Users" WHERE username='${username}' AND password='${password}'`;

    pool.query(queryString, function(error, result) {
        if (error) {
            console.log(error);
            response.status(400).send(error);
        } else 
            if (result.rowCount > 0) {
                console.log(`${username} deleted.`);
                response.status(200).send(`${username} deleted.`);
            }
            else {
                console.log(`${request.ip} tried to delete the account: ${username}`);
                response.status(401).send(`Authentication Failed: invalid username and/or password.`);
            }
    });
})

// Add a new song in the API.
app.post('/api/addSong', async function(request, response) {
    var title           = request.body.title.split("'").join("`");
    var artist          = request.body.artist.split("'").join("`");
    var tuning          = request.body.tuning.split("'").join("`");
    var capo            = request.body.capo.split("'").join("`");
    var note            = request.body.note.split("'").join("`");
    var content         = request.body.content.split("'").join("`");

    var username        = request.body.username;
    var password        = request.body.password;

    if (!await validateAuth(username, password))
        response.status(401).send(`Authentication Failed: invalid username and/or password.`);
    else if (!await validateSong(title, artist))
        response.status(403).send(`The song already exists.`);
    else { 
        var queryString = `INSERT INTO public."Songs" (title, username_fk, artist, tuning, capo, note, content) ` +
                          `VALUES ('${[title, username, artist, tuning, capo, note, content].join('\',\'')}')`;

        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log(`${username} added: ${title} by ${artist}`);
                response.status(200).send(`Song successfully added.`);
            }
        });
    }
});

// Edit a song in the API.
app.put('/api/editSong', async function(request, response) {
    var title           = request.body.title.split("'").join("`");
    var artist          = request.body.artist.split("'").join("`");
    var tuning          = request.body.tuning.split("'").join("`");
    var capo            = request.body.capo.split("'").join("`");
    var note            = request.body.note.split("'").join("`");
    var content         = request.body.content.split("'").join("`");

    var username        = request.body.username.split("'").join("`");
    var password        = request.body.password.split("'").join("`");

    if (await validateSong(title, artist))
        response.status(404).send(`Song not found.`);
    else if (await getUserFromTitle(title) != username)
        response.status(403).send(`The user: ${username}, does not have permission to edit the song.`);
    else if (!await validateAuth(username, password))
        response.status(401).send(`Authentication Failed: invalid username and/or password.`);
    else {
        var queryString = `UPDATE public."Songs" ` +
                          `SET artist='${artist}', tuning='${tuning}', capo='${capo}', note='${note}', content='${content}' ` + 
                          `WHERE title='${title}'`;
        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log(`${username} edited: ${title} by ${artist}`);
                response.status(200).send(`Song successfully edited.`);
            }
        });
    }
});

// Delete a song in the API.
app.delete('/api/deleteSong', async function(request, response) {
    var title           = request.body.title.split("'").join("`");
    var artist          = request.body.artist.split("'").join("`");
    var username        = request.body.username.split("'").join("`");
    var password        = request.body.password.split("'").join("`");

    if (await validateSong(title, artist))
        response.status(404).send('Song not found.');
    else if (await getUserFromTitle(title) != username)
        response.status(403).send(`The user: ${username}, does not have permission to delete the song.`);
    else if (!await validateAuth(username, password))
        response.status(401).send(`Authentication Failed: invalid username and/or password.`);
    else {
        var queryString = `DELETE FROM public."Songs" WHERE title='${title}' AND username_fk='${username}'`;
        pool.query(queryString, function(error, result) {
            if (error) {
                console.log(error);
                response.status(400).send(error);
            } else {
                console.log(`${username} deleted: ${title} by ${artist}`);
                response.status(200).send(`Song successfully deleted.`);
            }
        });
    }
});

// Get a song from the API
app.get('/api/getSong', async function(request, response) {
    var title           = request.query.title;
    var artist          = request.query.artist;

    var queryString     = `SELECT * FROM public."Songs" WHERE title='${title}' AND  artist='${artist}'`;
    var options         = {
        host:   'theaudiodb.com',
        path:   `/api/v1/json/${process.env.APIKEY}/searchtrack.php?s=${artist.split(" ").join("%20")}&t=${title.split(" ").join("%20")}`
    }

    try {
        var result_query = await pool.query(queryString);
        if (result_query.rowCount > 0) {
            // Request for extra data from the API theaudiodb.com
            var request = https.get(options, function (result) {
                console.log(`statusCode: ${result.statusCode}`);
                console.log(`headers: ${result.headers}`);

                result.on('data', function(data) {
                    // processing data from external API.
                    data = JSON.parse(data);

                    console.log(data);

                    var song_obj = {
                        title:      result_query.rows[0].title,
                        artist:     result_query.rows[0].artist,
                        tuning:     result_query.rows[0].tuning,
                        capo:       result_query.rows[0].capo,
                        note:       result_query.rows[0].content,
                        username:   result_query.rows[0].username,
                        album:      null,
                        trackNo:    null,
                        genre:      null,
                        musicVid:   null
                    }

                    if (data.track) {
                        song_obj.album      = data.track[0].strAlbum;
                        song_obj.trackNo    = data.track[0].intTrackNumber;
                        song_obj.genre      = data.track[0].strGenre;
                        song_obj.musicVid   = data.track[0].strMusicVid;
                    }

                    response.status(200).send(song_obj);
                });
            });

            request.on('error', function(error) {
                console.error(e);
            });

            request.end();
            
        } else response.status(404).send('Song not found.');

    } catch (error) {
        console.log(error);
        response.status(400).send(error);
    }
});

// Get a list of songs available in the API.
app.get('/api/songsList', function(request, response) {
    var queryString = `SELECT title, artist FROM public."Songs"`;
    pool.query(queryString, function(error, result) {
        if (error) {
            console.log(error);
            response.status(400).send(error);
        } else if (result.rowCount > 0) {
            response.status(200).send(JSON.stringify(result.rows));
        } else response.status(404).send('Songs not found.');
    });
});

// Get a list of songs by artist available in the API.
app.get('/api/songsListByArtist', function(request, response) {
    var artist          = request.query.artist.split("'").join("`");

    var queryString = `SELECT title, artist FROM public."Songs" WHERE artist='${artist}'`;
    pool.query(queryString, function(error, result) {
        if (error) {
            console.log(error);
            response.status(400).send(error);
        } else if (result.rowCount > 0) {
            response.status(200).send(JSON.stringify(result.rows));
        } else response.status(404).send('Songs not found.');
    });
});

// Get a list of songs by artist available in the API.
app.get('/api/songsListByTitle', function(request, response) {
    var title           = request.query.title.split("'").join("`");

    var queryString = `SELECT title, artist FROM public."Songs" WHERE title='${title}'`;
    pool.query(queryString, function(error, result) {
        if (error) {
            console.log(error);
            response.status(400).send(error);
        } else if (result.rowCount > 0) {
            response.status(200).send(JSON.stringify(result.rows));
        } else response.status(404).send('Songs not found.');
    });
});


/****************************/
/*        FUNCTIONS         */
/****************************/

async function getUserFromTitle(title) {
    var queryString = `SELECT username_fk FROM public."Songs" WHERE title='${title}'`;

    try {
        var result = await pool.query(queryString);
        return(result.rows[0].username_fk);
    } catch (error) {console.log(error);}
}

async function validateSong(title, artist) {
    var queryString = `SELECT * FROM public."Songs" WHERE title='${title}' AND  artist='${artist}'`;
    try {
        var result = await pool.query(queryString);
        if (result.rowCount == 0 && /^.{1,256}$/.test(title) && /^.{1,256}$/.test(artist))
            return true;
        else
            return false;
    } catch (error) {console.log(error);}
}

async function validateAuth(username, password) {
    var queryString = `SELECT * FROM public."Users" WHERE username='${username}' AND password='${password}'`;

    try {
        var result = await pool.query(queryString);
        if (result.rowCount > 0)
            return true;
        else
            return false;
        
    } catch (error) {console.log(error);}
}

async function validateUsername(username) {
    var queryString = `SELECT * FROM public."Users" WHERE username='${username}'`;

    if (/^[a-zA-Z0-9_\.\-]{5,20}$/.test(username))
        try {
            var result = await pool.query(queryString);
            if (result.rowCount == 0)
                return true;
            else
                return false;
        } catch (error) {console.log(error);} 
    else 
        return false;
}        

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_.!@#\$%\^&\*\\])(?=.{6,})/.test(password);
}
