// Function linked to the search button:
// type == true  => search by title.
// type == false => search by artist.
function searchSongs(type) {
    if (type === true) {
        var search  = document.getElementById('title').value;
        var url     = `/searchSongsByTitle?search=${search.split(' ').join('%20')}`;

        if (search)
            location.href = url;
    } else {
        var search  = document.getElementById('artist').value;
        var url     = `/searchSongsByArtist?search=${search.split(' ').join('%20')}`;

        if (search)
            location.href = url;
    }
}

// Function that creates html code for displaying a song.
function showSong(data) {
    console.log(data);

    var song    = JSON.parse(data.responseText);
    var element = null;
    var att     = null;
    var text    = null;

    // Add title
    element = document.getElementById('title');
    text    = document.createTextNode(song.title);
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
        att.value   = `https://${song.musicVid}`;
        element.setAttributeNode(att);
    } else {
        att     = document.createAttribute('class');
        att.value   = 'btn btn-primary btn-xs disabled';
        element.setAttributeNode(att);
    }

    // Add song owner
    element = document.getElementById('owner');
    text    = document.createTextNode(song.owner);
    element.appendChild(text);

    // Add song owner in modal
    element = document.getElementById('owner-modal');
    text    = document.createTextNode(song.owner);
    element.appendChild(text);

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

    // Add delete button
    element     = document.getElementById('delete-btn');
    att         = document.createAttribute('class');
    att.value   = 'btn btn-danger btn-xs';
    element.setAttributeNode(att);
    att         = document.createAttribute('data-toggle');
    att.value   = 'modal';
    element.setAttributeNode(att)
    att         = document.createAttribute('data-target');
    att.value   = '#passModal';
    element.setAttributeNode(att);
    text        = document.createTextNode('Delete');
    element.appendChild(text);

    // Add edit button
    element     = document.getElementById('edit-btn');
    att         = document.createAttribute('class');
    att.value   = 'btn btn-warning btn-xs';
    element.setAttributeNode(att);
    att         = document.createAttribute('href');
    att.value   = `/editSong?title=${song.title.split(" ").join("%20")}&artist=${song.artist.split(" ").join("%20")}`;
    element.setAttributeNode(att);
    text        = document.createTextNode('Edit');
    element.appendChild(text);
}

// Function that creates html code for displaying a list of songs.
function createSongList(data) {
    console.log(data);
    var element         = document.getElementById('result-div');
    var tag             = null;
    var att             = null;
    var text            = null;
    
    if (data.status == 200) {
        var songs   = JSON.parse(data.responseText);
        
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
        tag         = document.createElement('h3');
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

function fillInputFields(data) {
    console.log(data);

    var song    = JSON.parse(data.responseText);
    var element = null;
    var att     = null;

    document.getElementById('title').value = song.title;
    document.getElementById('artist').value = song.artist;
    document.getElementById('tuning').value = song.tuning;
    document.getElementById('capo').value = song.capo;
    document.getElementById('note').value = song.note;
    document.getElementById('content').value = song.content;
    document.getElementById('username').value = song.owner;

    // add onclick for Edit button
    element = document.getElementById('edit-btn');
    att         = document.createAttribute('onclick');
    att.value   = 'editSong()';
    element.setAttributeNode(att);
}

function signIn() {
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;
    var passConf    = document.getElementById('passwordConfirm').value;

    if (username && password && passConf)
        if (passConf == password) {
            var url     = '/api/join';
            httpPostAsync(url, null, username, password, function(result) {
                console.log(result);
                alert(result.responseText);
                if (result.status == 200)
                    window.location.href = '/';
            });
        } else
            alert('The two passwords must match.');
    else
        alert('You must enter all the required data.');
}

function deleteUser() {
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;

    if (username && password) {
        var url     = '/api/deleteAccount';
        httpDeleteAsync(url, username, password, function(result) {
            console.log(result);
            alert(result.responseText);
            if (result.status == 200)
                window.location.href = '/';
        });
    } else
        alert('You must enter all the required data.');
}

function addSong() {
    var title       = document.getElementById('title').value;
    var artist      = document.getElementById('artist').value;
    var tuning      = document.getElementById('tuning').value;
    var capo        = document.getElementById('capo').value;
    var note        = document.getElementById('note').value;
    var content     = document.getElementById('content').value;
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;

    if (title && artist && username && password) {
        var url     = '/api/addSong';
        var body  = `title=${title}&artist=${artist}&tuning=${tuning}&capo=${capo}` +
                      `&note=${note}&content=${content}`;
        httpPostAsync(url, body, username, password, function(result) {
            console.log(result);
            alert(result.responseText);
            if (result.status == 200)
                window.location.href = '/';
        });
    } else
        alert('You must enter all the required data.');
}

function editSong() {
    var title       = document.getElementById('title').value;
    var artist      = document.getElementById('artist').value;
    var tuning      = document.getElementById('tuning').value;
    var capo        = document.getElementById('capo').value;
    var note        = document.getElementById('note').value;
    var content     = document.getElementById('content').value;
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;

    if (title && artist && username && password) {
        var url     = `./api/song/${artist.split(" ").join("%20")}/${title.split(" ").join("%20")}`;
        var body    = `tuning=${tuning}&capo=${capo}&` +
                      `note=${note}&content=${content}`;
        httpPutAsync(url, body, username, password, function(result) {
            console.log(result);
            alert(result.responseText);
            if (result.status == 200)
                window.location.href = `/showSong?title=${title}&artist=${artist}`;;
        });
    } else
        alert('You must enter the password.');
}

function deleteSong() {
    var title       = document.getElementById('title').textContent;
    var artist      = document.getElementById('artist').textContent;
    var username    = document.getElementById('owner').textContent;
    var password    = document.getElementById('password').value;

    var element = null;
    var att     = null;
    var text    = null;

    if (password) {
        var url     = `./api/song/${artist.split(" ").join("%20")}/${title.split(" ").join("%20")}`;
        httpDeleteAsync(url, username, password, function(result) {
            alert(result.responseText);
            if (result.status == 200)
                window.location.href = '/';
        });
    } else {
        // Add error on modal
        element = document.getElementById('error');
        text    = document.createTextNode('You must enter the password!');
        element.appendChild(text);
    }
}

// Generic function to perform GET requests.
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url, true);     // true for asynchronous 
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == XMLHttpRequest.DONE)
            callback(xmlHttp);
    }
    xmlHttp.send(null);
}

// Generic function to perfotm POST request.
function httpPostAsync(url, body, username, password, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', url, true);    // true for asynchronous 

    //Send the proper header information along with the request
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (username && password) {
        xmlHttp.setRequestHeader('username', username);
        xmlHttp.setRequestHeader('password', password);
    }

    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == XMLHttpRequest.DONE) {
            callback(xmlHttp);
        }
    }  
    xmlHttp.send(body);
}

// Generic function to perfotm DELETE request.
function httpDeleteAsync(url, username, password, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", url, true);      // true for asynchronous

    //Send the proper header information along with the request
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (username && password) {
        xmlHttp.setRequestHeader('username', username);
        xmlHttp.setRequestHeader('password', password);
    }

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == XMLHttpRequest.DONE)
            callback(xmlHttp);
    }
    xmlHttp.send(null);
}

// Generic function to perfotm PUT request.
function httpPutAsync(url, body, username, password, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", url, true);     // true for asynchronous

    //Send the proper header information along with the request
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (username && password) {
        xmlHttp.setRequestHeader('username', username);
        xmlHttp.setRequestHeader('password', password);
    }

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == XMLHttpRequest.DONE)
            callback(xmlHttp);
    }
    xmlHttp.send(body);
}