function searchSong() {
    var title   = document.getElementById('title').value;
    var url     = `./searchTitle?title=${title.split(" ").join("%20")}`;

    if (title)
        location.href = url;
}

function createSongList(data) {
    console.log(data);
    var element = document.getElementById('songList');
    var tag     = null;
    var text    = null;    
    if (data.status == 200) {
        var songs   = JSON.parse(data.responseText);
        tag     = document.createElement('h1');
        text    = document.createTextNode(`Results for: ${title}.`);
        tag.appendChild(text);
        element.appendChild(tag);
        tag     = document.createElement('ul');
        element.appendChild(tag);
        for (var i = 0; (i < songs.length); i++) {
            tag     = document.createElement('li');
            text    = document.createTextNode(`${songs[i].title} - ${songs[i].artist}`);
            tag.appendChild(text);
            element.appendChild(tag);
        }
    } else {
        tag     = document.createElement('h1');
        text    = document.createTextNode(`Error 404: ${data.responseText}`);
        tag.appendChild(text);
        element.appendChild(tag);
        tag     = document.createElement('h3');
        text    = document.createTextNode(`No results for: ${title}`);
        tag.appendChild(text);
        element.appendChild(tag);
    }
}

// Generic function to perform get requests.
function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}