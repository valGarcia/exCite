function getCiteData (citeurl) {
//      var df = new $.Deferred(),
          self = this;

//      debug.log('fetching cite data');
//      chrome.windows.getCurrent(function (currentWindow) {
//       chrome.tabs.getSelected(currentWindow.id, function (selectedTab) {
//          debug.log('fetching it');
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
		  
		  //.done(function (resp) {
 //           debug.log('got response', resp);
        //     if (resp.status === 'ok') {
        //       df.resolve(resp.data.data);
        //     } else {
        //       df.reject(resp);
        //     }
        //   }).fail(function (err) {
        //     df.reject(err);
        //   });
//        });
//      });
//      return df;
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

function submitted(event){
	console.log(form);
}

//given an array of URLs, build a DOM list of those URLs 
//in the browser action popup
function buildPopopDom(divName, data){
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
	
	for(var i = 0, ie = data.length; i < ie; i++){
		var a = document.createElement('a');
		//makes data refer to 'a' url
		a.href = data[i];
		//makes the text of the data here a child of 'a'
		a.appendChild(document.createTextNode(data[i]));
		//makes the link listen for a click
		//a.addEventListener('click', onAnchorClick);
		
		//makes a list item
		var input = document.createElement('input');
		input.setAttribute("type","checkbox");
		input.setAttribute("value",data[i]);
		form.appendChild(input);
		form.appendChild(a);
		
		var linebreak = document.createElement('br');
		form.appendChild(linebreak);
	}
	
	var submitelement = document.createElement('input'); // Append Submit Button
	submitelement.setAttribute("type", "submit");
	submitelement.setAttribute("name", "dsubmit");
	submitelement.setAttribute("value", "Submit");
	form.appendChild(submitelement);
	var linksToCite = $(submitelement).on("click", function(e){	
		e.preventDefault();
		var listofLinks = [];
		var children = form.childNodes; 
		for (i = 0, ie = children.length; i < ie; ++i) {
			if(children[i].localName == "input" && children[i].checked)
			{
				listofLinks.push(children[i].value);
			}
		}
		return listofLinks;
	});
	
	var url = "http://www.nytimes.com/2015/10/24/opinion/reinventing-the-library.html"
	console.log(getCiteData(url));
	
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