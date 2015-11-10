// set up variables for search query and pagination
var streamSrc = 'starcraft';
var offset = 0;

var emptyString = "";
var searchBtn = document.getElementById('searchBtn');
var searchInput = document.getElementById('streamSearch');

searchBtn.addEventListener('click', searchStreams, false);
function searchStreams() {
	// if searchInput value is null 
	if(searchInput.value.length === 0) {
		alert("enter a stream to search");
	}
	// else streamSrc equals input value
	else {
		offset = 0; // reset offset for each search
		streamCountText.textContent = (offset + 1) + "/" + (offset + 10); // reset streamCount
		streamSrc = searchInput.value;
		// find and remove previous script query from DOM
		var oldScript = document.getElementById('script');
		document.head.removeChild(oldScript);
		buildQuery();
		searchInput.value = ""; // reset input value
	}
}

// dynamically build script tag and insert in header
function buildQuery() {
	var head = document.head;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.id = "script"; // need id to remove element later
	script.src = 'https://api.twitch.tv/kraken/search/streams?q=' + streamSrc + '&callback=myCallback' + '&limit=10&offset=' + offset + ''; 
	head.appendChild(script);	
}

var prevStream = document.getElementById("prevStream");
var prevText = document.createElement('i');
prevText.classList.add("fa");
prevText.classList.add("fa-chevron-circle-left");
prevStream.appendChild(prevText);

var nextStream = document.getElementById("nextStream");
var nextText = document.createElement('i');
nextText.classList.add("fa");
nextText.classList.add("fa-chevron-circle-right");
nextStream.appendChild(nextText);

var streamCount = document.getElementById('streamCount');
var streamCountText = document.createElement('p');
streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
streamCount.appendChild(streamCountText);

(function buildPagination() {

	nextText.addEventListener('click', function() {
		offset = offset + 10;
		streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
		console.log(offset);
		// remove old script
		var oldScript = document.getElementById('script');
		document.head.removeChild(oldScript);
		buildQuery();
	}, false); // end nextLink click event

	prevText.addEventListener('click', function() {
		offset = offset - 10;
		streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
		console.log(offset);
		// remove old script
		var oldScript = document.getElementById('script');
		document.head.removeChild(oldScript);
		buildQuery();
	}, false); // end prevLink click event

}()); // end buildPagination

// retrieve data from api
function myCallback(data){

  	console.log(data);
	// declare variables and build feeds
	var feedContainer = document.getElementById("feeds");
	var feedDiv = document.createDocumentFragment();
	var feedTotalDiv = document.getElementById("feedTotal");
	var feedTotalP = document.createElement('p');
	feedTotalP.textContent = "Total results: " + data._total;

	var feedList = document.createElement('ul');
	var streamsLen = data.streams.length;

	(function buildFeed() {
		// clear out previous feed if any
		feedContainer.innerHTML = emptyString;

		for (var i = 0; i < streamsLen; i++) {
                        // set up variables for feed list
			var li = document.createElement('li'),
                        streamTitle = document.createElement('h2'),
                        streamLink = document.createElement('a'),
                        img = new Image(),
                        gameTitle = document.createElement('p'),
                        viewerSpan = document.createElement('span'),
                        gameDesc = document.createElement('p');

			img.src = data.streams[i].preview.medium;
			streamTitle.textContent = data.streams[i].channel.display_name;
                        streamLink.setAttribute('href', data.streams[i].channel.url);
                        streamLink.setAttribute('target', '_blank');
                        streamLink.appendChild(streamTitle);
			gameTitle.textContent = data.streams[i].game;
			viewerSpan.textContent = " - " + data.streams[i].viewers + " viewers";
			viewerSpan.className = 'viewers';
			gameDesc.textContent = data.streams[i].channel.status;
			li.appendChild(img);
                        li.appendChild(streamLink);
			li.appendChild(gameTitle);
			gameTitle.appendChild(viewerSpan);
			li.appendChild(gameDesc);
			feedList.appendChild(li);
			feedDiv.appendChild(feedList);
			
		} // end for loop
		feedTotalDiv.innerHTML = emptyString;
		feedTotalDiv.appendChild(feedTotalP);
		
		feedContainer.appendChild(feedDiv);	
	
	}());
	
	// if no search results render message to page
	if(streamsLen < 1) {
		var noResults = "Sorry, your search query returned 0 results. Please try again.";
                feedContainer.innerHTML = noResults;
	}
    
} // end myCallback

