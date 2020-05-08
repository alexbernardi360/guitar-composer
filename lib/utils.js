var pg              = require('pg');
var parse_cs        = require('pg-connection-string').parse;

// db connection
var config          = parse_cs(process.env.DATABASE_URL);
var pool            = new pg.Pool(config);


/****************************/
/*        FUNCTIONS         */
/****************************/

async function getUserFromTitle(title) {
    var queryString = `SELECT username_fk FROM public."Songs" WHERE title ILIKE '${title}'`;

    try {
        var result = await pool.query(queryString);
        return(result.rows[0].username_fk);
    } catch (error) {console.log(error);}
}

async function validateSong(title, artist) {
    var queryString = `SELECT * FROM public."Songs" WHERE title ILIKE '${title}' AND  artist='${artist}'`;
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


/****************************/
/*         EXPORTS          */
/****************************/

exports.pool                = pool;
exports.getUserFromTitle    = getUserFromTitle;
exports.validateSong        = validateSong;
exports.validateAuth        = validateAuth;
exports.validateUsername    = validateUsername;
exports.validatePassword    = validatePassword;