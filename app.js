// set up variables for search query and pagination
var streamSrc = 'starcraft';
var offset = 0;
//default empty string value
var emptyString = "";

var searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', searchStreams, false);

function searchStreams() {
	var searchInput = document.getElementById('streamSearch');
	// if searchInput value is null 
	if(searchInput.value.length === 0) {
		alert("enter a stream to search");
	}
	else {
		offset = 0; // reset offset for each search
		streamCountText.textContent = (offset + 1) + "/" + (offset + 10); 
		streamSrc = searchInput.value;
		// find and remove previous script query from DOM
		var oldScript = document.getElementById('script');
		document.head.removeChild(oldScript);
		buildQuery();
		searchInput.value = emptyString; // reset input value
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

// pagination elements
var prevStream = document.getElementById("prevStreamBtn");
var nextStream = document.getElementById("nextStreamBtn");

var streamCount = document.getElementById('streamCount');
var streamCountText = document.createElement('p');
streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
streamCount.appendChild(streamCountText);

(function buildPagination() {

	nextStream.addEventListener('click', function() {
		offset = offset + 10;
		streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
		console.log(offset);
		// remove old script
		var oldScript = document.getElementById('script');
		document.head.removeChild(oldScript);
		buildQuery();
	}, false); // end nextLink click event

	prevStream.addEventListener('click', function() {
                if(offset <= 0) {
                   return false; 
                }
                else {
                    offset = offset - 10;
                    streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
                    console.log(offset);
                    // remove old script
                    var oldScript = document.getElementById('script');
                    document.head.removeChild(oldScript);
                    buildQuery();    
                }
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
                        gameTitle.classList.add('streamSubTitle');
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
		feedTotalDiv.innerHTML = emptyString; // clear previous total
		feedTotalDiv.appendChild(feedTotalP);
		feedContainer.appendChild(feedDiv);	
	}());
	
	// if no search results render message to page
	if(streamsLen < 1) {
		var noResults = "Sorry, your search query returned 0 results. Please try again.";
                feedContainer.innerHTML = noResults;
	} 
} // end myCallback