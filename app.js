// dynamically build script tag and insert in header
var streamSrc = 'starcraft';
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://api.twitch.tv/kraken/search/streams?q=' + streamSrc + '&callback=myCallback';
head.appendChild(script);

// retrieve data from api
function myCallback(data){

  	console.log(data);
	// declare variables for feeds
	var feedContainer = document.getElementById("feeds");
	var feedDiv = document.createDocumentFragment();
	var feedList = document.createElement('ul');
	var streamsLen = data.streams.length;
	for (var i = 0; i < streamsLen; i++) {
		// console.log(data.streams[i].channel.name);
		// console.log(data.streams[i].game);
		var li = document.createElement('li');
		var streamTitle = document.createElement('h2');
		var img = new Image();
		var gameTitle = document.createElement('p');
		var viewerSpan = document.createElement('span');
		var gameDesc = document.createElement('p');

		img.src = data.streams[i].preview.medium;
		streamTitle.textContent = data.streams[i].channel.display_name;
		gameTitle.textContent = data.streams[i].game;
		viewerSpan.textContent = " - " + data.streams[i].viewers + " viewers";
		viewerSpan.className = 'viewers';
		gameDesc.textContent = data.streams[i].channel.status;
		li.appendChild(img);
		li.appendChild(streamTitle);
		li.appendChild(gameTitle);
		gameTitle.appendChild(viewerSpan);
		li.appendChild(gameDesc);
		feedList.appendChild(li);
		feedDiv.appendChild(feedList); // this is my doc frag
		feedContainer.appendChild(feedDiv);

	}
    
}




