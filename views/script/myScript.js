function searchSong() {
    var title   = document.getElementById('title').value;
    var url     = `./searchTitle?title=${title.split(" ").join("%20")}`;

    if (title)
        location.href = url;
}

function createSongList(data) {
    console.log(data);
    var songs = JSON.parse(data.responseText);
    console.log(songs);
    var element = document.getElementById("songList");
    var tag = document.createElement("ul");
    element.appendChild(tag);
    var text = '';
    if (data.status == 200)
        for (var i = 0; i < songs.length; i++) {
            tag = document.createElement("li");
            text = document.createTextNode(`${songs[i].title} - ${songs[i].artist}`);
            tag.appendChild(text);
            element.appendChild(tag);
        }
    else {
        tag = document.createElement("li");
        text = document.createTextNode(songs.responseText);
        tag.appendChild(text);
        element.appendChild(tag);
}
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}