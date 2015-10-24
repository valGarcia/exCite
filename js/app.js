//Event listener for clicks in a browser action popop.
//open the link in a new tab of the current window.
function onAnchorClick(event){
	chrome.tabs.create({
		selected: true,
		url: event.srcElement.href
	});
	return false;
}

//given an array of URLs, build a DOM list of those URLs 
//in the browser action popup
function buildPopopDom(divName, data){
	var popupDiv = document.getElementById(divName);
	//create an unordered list
	var ul = document.createElement('ul');
	//calls this a child of popupDiv
	popupDiv.appendChild(ul);
	
	for(var i = 0, ie = data.length; i < ie; i++){
		var a = document.createElement('a');
		//makes data refer to 'a' url
		a.href = data[i];
		//makes the text of the data here a child of 'a'
		a.appendChild(document.createTextNode(data[i]));
		//makes the link listen for a click
		a.addEventListener('click', onAnchorClick);
		
		//makes a list item
		var li = document.createElement('li');
		li.appendChild(a);
		ul.appendChild(li);		
	}
}

//I just want to print out a bunch of history
function buildUrlList(divName){
	var microsecondsPerDay = 1000 * 60 * 60 * 24;
	//subtract a day of microseconds from the current time
	var oneDayAgo = (new Date).getTime() - microsecondsPerDay;
	
	chrome.history.search({
		'text': '',		//return every history item
		'startTime': oneDayAgo	//accessed less than one day ago
	}, 
	
	function(historyItems){
		var urls = [];
		for(var i = 0; i < historyItems.length; i++){
			var url = historyItems[i].url;
			urls.push(url);
		}
		buildPopopDom(divName, urls);
	})
}

document.addEventListener('DOMContentLoaded', function () {
	console.log("I DID THING");
	buildUrlList("app_div");
});