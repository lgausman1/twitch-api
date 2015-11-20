// set up variables for search query and pagination
var streamSrc = 'starcraft',
offset = 0,
emptyString = "";

// dynamically build script tag and insert in header
function buildQuery() {
  var head = document.head,
  script = document.createElement('script');
  script.type = 'application/javascript';
  script.id = 'script';
  script.src = 'https://api.twitch.tv/kraken/search/streams?q=' + streamSrc + '&callback=myCallback&limit=10&offset=' + offset + ''; 
  head.appendChild(script);	
}

// retrieve data from api
function myCallback(data){
  console.log(data);
  // declare variables and build feeds
  var feedContainer = document.getElementById('feeds'),
  feedDiv = document.createDocumentFragment(),
  feedTotalDiv = document.getElementById('feedTotal'),
  feedTotalP = document.createElement('p'),
  feedList = document.createElement('ul'),
  streamsLen = data.streams.length;

  feedTotalP.textContent = "Total results: " + data._total;

(function buildFeed() {

  feedContainer.innerHTML = emptyString;

  for (var i = 0; i < streamsLen; i++) {
    // build feed elements
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
  }()); // end build feed

  // if no search results render message to page
  if(streamsLen < 1) {
    var noResults = "Sorry, your search query returned 0 results. Please try again.";
    feedContainer.textContent = noResults;
    } 
  }  // end myCallback

  function replaceScript() {
    var oldScript = document.getElementById('script');
    document.head.removeChild(oldScript);
  }

  function searchStreams() {
    var searchInput = document.getElementById('streamSearch'),
    searchError = document.getElementById('searchError'); 
    if(searchInput.value.length === 0) {
      //return message to user
      searchError.textContent = "Please enter a search term.";
    } else {
      offset = 0;
      streamCountText.textContent = (offset + 1) + "/" + (offset + 10); 
      streamSrc = searchInput.value; // set the query parameter
      replaceScript(); // remove script
      buildQuery(); // replace script
      searchError.textContent = emptyString;
      searchInput.value = emptyString;
    }
  } // end searchStreams

  var searchBtn = document.getElementById('searchBtn');
  searchBtn.addEventListener('click', searchStreams, false);

  // pagination elements
  var prevStream = document.getElementById('prevStreamBtn'),
  nextStream = document.getElementById('nextStreamBtn'),
  streamCount = document.getElementById('streamCount'),
  streamCountText = document.createElement('p');

  streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
  streamCount.appendChild(streamCountText);

  (function buildPagination() {

    nextStream.addEventListener('click', function() {
      offset = offset + 10;
      streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
      replaceScript();
      buildQuery();
    }, false); // end nextStream

    prevStream.addEventListener('click', function() {
      if(offset === 0) {
        return false; 
      } else {
        offset = offset - 10;
        streamCountText.textContent = (offset + 1) + "/" + (offset + 10);
        replaceScript();
        buildQuery();    
      }
    }, false); // end prevStream

  }());  // end buildPagination