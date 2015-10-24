function getCiteData (citeurl) {
          self = this;

          return $.ajax({
            url: 'http://autocite.easybib.com/index/json',
            type: 'GET',
            dataType: 'JSON',
            timeout: self.timeout,
            data: {
              url: citeurl
            }, 
			async: false
          }).responseJSON;
		  
}


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
function buildPopupDom(divName, data){
	var popupDiv = document.getElementById(divName);
	//create an unordered list
	var form = document.createElement('form');
	form.setAttribute("action","");
	form.setAttribute("method", "post");
	form.setAttribute("enctype","application/json");
	popupDiv.appendChild(form);
	
	var heading = document.createElement('h2');
	heading.innerHTML = "Pick the links you want";
	form.appendChild(heading);
	
	var line = document.createElement('hr');
	form.appendChild(line);
	
	var linebreak = document.createElement('br');
	form.appendChild(linebreak);
	
	//make map of regular expressions to make finding urls easier
	var map = {};
	for(var j = 0; j < data.length; j++){
		var re = /http[s]?\:\/\/[^\/]+\/*/;
		var url = data[j];
		var root = re.exec(url)[0];
		if(!(root in map)){
			map[root] = [];
		}
		map[root].push(url);
		
	}
	console.log(map);
	
	//loop through map
	//make the map a paragraph and show it's keys(urls) with checkboxes
	for(var key in map){
		var par = document.createElement('p');
		par.innerText = key;
		form.appendChild(par);
		for(var k = 0; k < map[key].length; k++){
			var a = document.createElement('a');
			//makes data refer to 'a' url
			a.href = map[key][k];
			//makes the text of the data here a child of 'a'
			a.appendChild(document.createTextNode(map[key][k]));
			//makes the link listen for a click
			
			//makes a list item
			var input = document.createElement('input');
			input.setAttribute("type","checkbox");
			input.setAttribute("value",map[key][k]);
			form.appendChild(input);
			form.appendChild(a);
			
			linebreak = document.createElement('br');
			form.appendChild(linebreak);
		}
		linebreak = document.createElement('br');
		form.appendChild(linebreak);
	}
	
	var submitelement = document.createElement('input'); // Append Submit Button
	submitelement.setAttribute("type", "submit");
	submitelement.setAttribute("name", "dsubmit");
	submitelement.setAttribute("value", "Submit");
	form.appendChild(submitelement);
	
	var listofLinks = [];
	$(submitelement).on("click", function(e){	
		e.preventDefault();
		var children = form.childNodes; 
		for (i = 0, ie = children.length; i < ie; ++i) {
			if(children[i].localName == "input" && children[i].checked)
			{
				listofLinks.push(getCiteData(children[i].value));		
			}
		}
		// chrome.fileSystem.chooseEntry("filename", function(entry){
		// 	console.log(entry);
		// }
		// 	);
		parselinks(listofLinks);
	});

}



//I just want to print out a bunch of history
function buildUrlList(divName){
	var microsecondsPerHour = 1000 * 60 * 60;
	//subtract a day of microseconds from the current time
	var oneHourAgo = (new Date).getTime() - microsecondsPerHour;
	
	chrome.history.search({
		'text': '',		//return every history item
		'startTime': oneHourAgo	//accessed less than one day ago
	}, 
	
	function(historyItems){
		var urls = [];
		for(var i = 0; i < historyItems.length; i++){
			var url = historyItems[i].url;
			urls.push(url);
		}
		buildPopupDom(divName, urls);
	})
}

document.addEventListener('DOMContentLoaded', function () {
	console.log("I DID THING");
	buildUrlList("app_div");
});

