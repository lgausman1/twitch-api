// set up variables for search query and pagination
var streamSrc = 'starcraft';
var offset = 0;

var searchBtn = document.getElementById('searchBtn');
var searchInput = document.getElementById('streamSearch');

searchBtn.addEventListener('click', searchStreams, false);
function searchStreams() {
	// if searchInput value is null 
	if(searchInput.value.length == 0) {
		alert("enter a stream to search");
	}
	// else streamSrc equals input value
	else {
		streamSrc = searchInput.value;
		buildQuery();

	}
}

// dynamically build script tag and insert in header
function buildQuery() {
	var head = document.head;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://api.twitch.tv/kraken/search/streams?q=' + streamSrc + '&callback=myCallback' + '&limit=10&offset=' + offset + '';
	head.appendChild(script);	
}

// retrieve data from api
function myCallback(data){

  	console.log(data);
	// declare variables and build feeds
	var feedContainer = document.getElementById("feeds");
	var feedDiv = document.createDocumentFragment();
	var feedTotal = document.createElement('p');
	feedTotal.textContent = "Total results: " + data._total;
	var feedList = document.createElement('ul');
	var streamsLen = data.streams.length;

	function buildFeed() {
		// clear out previous feed if any
		feedContainer.innerHTML = "";

		for (var i = 0; i < streamsLen; i++) {

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
			feedDiv.appendChild(feedTotal);
			feedDiv.appendChild(feedList); // this is my doc frag
			

		} // end for loop
		feedContainer.appendChild(feedDiv);	
	} // end buildFeed
	buildFeed();
    
}

