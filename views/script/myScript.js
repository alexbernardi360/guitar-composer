function searchSong() {
    var title   = document.getElementById('title').value;
    var url     = `/searchTitle?title=${title.split(' ').join('%20')}`;

    if (title)
        location.href = url;
}

function signIn() {
    var username    = document.getElementById('username').value;
    var password    = document.getElementById('password').value;
    var passConf    = document.getElementById('passwordConfirm').value;

    var element     = document.getElementById('result-div');
    var tag         = document.createElement('label');
    var att = document.createAttribute("class");
    att.value = "control-lable";
    tag.setAttributeNode(att);
    var text        = null;
    if (username && password && passConf) {
        if (passConf == password) {
            var url     = '/api/join';
            var params  = `username=${username}&password=${password}`
            httpPostAsync(url, params, function(result) {
                console.log(result);
                alert(result.responseText);   
            });
        } else
            alert('The two passwords must match.');
    } else
        alert('You must enter all the required data.');
    
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