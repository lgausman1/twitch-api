// dynamically build script tag and insert in header
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://api.twitch.tv/kraken/search/streams?q=starcraft&callback=myCallback';
head.appendChild(script);

// retrieve data from api
function myCallback(data){

  	console.log(data);
  	// data.streams[i].preview.small;
	// declare variables for feeds
	var feedContainer = document.getElementById("feeds");
	var feedDiv = document.createDocumentFragment();
	var feedList = document.createElement('ul');
	var streamsLen = data.streams.length;
	for (var i = 0; i < streamsLen; i++) {
		console.log(data.streams[i].channel.name);
		console.log(data.streams[i].preview.small);
		var li = document.createElement('li');
		var img = new Image();
		img.src = data.streams[i].preview.small;

		li.textContent = data.streams[i].channel.name;
		li.appendChild(img);
		feedList.appendChild(li);
		feedDiv.appendChild(feedList);
		feedContainer.appendChild(feedDiv);

	}
    //var twitterEntry;
    //var text = '';
    //var len = dataWeGotViaJsonp.length;
    //for(var i=0;i<len;i++){
    //    twitterEntry = dataWeGotViaJsonp[i];
    //    //text += '<p>' + twitterEntry['text'] + '</p>'
    //    console.log(twitterEntry);
    //}
    //document.getElementById('feeds').innerHTML = data.streams[0].channel.name;
    // return data;
    
}




