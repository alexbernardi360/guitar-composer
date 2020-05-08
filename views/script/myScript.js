function searchSong() {
    var title   = document.getElementById('title').value;
    var url     = `/searchTitle?title=${title.split(' ').join('%20')}`;

    if (title)
        location.href = url;
}

function showSong(data) {
    console.log(data);

    var song    = JSON.parse(data.responseText);
    var element = null;
    var att     = null;
    var text    = null;

    // Add title
    var element = document.getElementById('title');
    var text    = document.createTextNode(song.title);
    element.appendChild(text);
    
    // Add artist
    element = document.getElementById('artist');
    text    = document.createTextNode(song.artist);
    element.appendChild(text);

    // Add tuning
    element = document.getElementById('tuning');
    text    = document.createTextNode(song.tuning);
    element.appendChild(text);

    // Add capo
    element = document.getElementById('capo');
    text    = document.createTextNode(song.capo);
    element.appendChild(text);

    // Add music video link
    element     = document.getElementById('musicVid');
    if (song.musicVid != null) {
        att     = document.createAttribute('href');
        att.value   = song.musicVid;
        element.setAttributeNode(att);
    } else {
        att     = document.createAttribute('class');
        att.value   = 'btn btn-primary disabled';
        element.setAttributeNode(att);
    }

    // Add album
    element = document.getElementById('album');
    if (song.album != null)
        text    = document.createTextNode(song.album);
    else 
        text = document.createTextNode('unavailable.');
    element.appendChild(text);

    // Add trackNo
    element = document.getElementById('trackNo');
    if (song.trackNo != null)
        text    = document.createTextNode(song.trackNo);
    else 
        text = document.createTextNode('unavailable.');
    element.appendChild(text);

    // Add genre
    element = document.getElementById('genre');
    if (song.genre != null)
        text    = document.createTextNode(song.genre);
    else 
        text = document.createTextNode('unavailable.')
    element.appendChild(text)

    // Add note
    element = document.getElementById('note');
    text    = document.createTextNode(song.note);
    element.appendChild(text);

    // Add content
    element = document.getElementById('content');
    text    = document.createTextNode(song.content);
    element.appendChild(text);
}

function createSongList(data) {
    console.log(data);
    var element         = document.getElementById('result-div');
    var tag             = document.createElement('h1');
    var att             = null;
    var text            = null;
    
    if (data.status == 200) {
        var songs   = JSON.parse(data.responseText);
        text    = document.createTextNode(`Results for: ${title}.`);
        tag.appendChild(text);
        element.appendChild(tag);
        
        for (var i = 0; (i < songs.length); i++) {
            tag         = document.createElement('a');
            att         = document.createAttribute('class');
            att.value   = 'list-group-item list-group-item-action';
            tag.setAttributeNode(att);
            att         = document.createAttribute('href');
            att.value   = `/showSong?title=${songs[i].title}&artist=${songs[i].artist}`;
            tag.setAttributeNode(att);
            text        = document.createTextNode(`${songs[i].title} - ${songs[i].artist}`);
            tag.appendChild(text);
            element.appendChild(tag);
        }

    } else {
        text        = document.createTextNode(`Error 404: ${data.responseText}`);
        tag.appendChild(text);
        element.appendChild(tag);

        tag         = document.createElement('a');
        att         = document.createAttribute('class');
        att.value   = 'list-group-item list-group-item-action';
        tag.setAttributeNode(att);
        att         = document.createAttribute('href');
        att.value   = '/';
        tag.setAttributeNode(att);
        text        = document.createTextNode('Home Page');
        tag.appendChild(text);
        element.appendChild(tag);
    }
}

function signIn() {
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;
    var passConf    = document.getElementById('passwordConfirm').value;

    if (username && password && passConf) {
        if (passConf == password) {
            var url     = '/api/join';
            var params  = `username=${username}&password=${password}`
            httpPostAsync(url, params, function(result) {
                console.log(result);
                alert(result.responseText);
                if (result.status == 200)
                    window.location.href = "/";
            });
        } else
            alert('The two passwords must match.');
    } else
        alert('You must enter all the required data.');
}

// Generic function to perform GET requests.
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == XMLHttpRequest.DONE)
            callback(xmlHttp);
    }
    xmlHttp.open('GET', url, true);     // true for asynchronous 
    xmlHttp.send(null);
}

// Generic function to perfotm POST request.
function httpPostAsync(url, params, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', url, true);    // true for asynchronous 

    //Send the proper header information along with the request
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == XMLHttpRequest.DONE) {
            callback(xmlHttp);
        }
    }  
    xmlHttp.send(params);
}