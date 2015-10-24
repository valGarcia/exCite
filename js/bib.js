function parselinks(arr){
//	console.log(arr);
	var popupDiv = document.getElementById("app_div");
	popupDiv.setAttribute("hidden","true");
	var newDiv = document.getElementById("bib_div");
	
	for(var i = 0; i < arr.length; i++){
		if(arr[i].status == "ok"){
//			console.log(arr[i].data.data);
			var str = "";
			var root = arr[i].data.data;
			str = str.concat(root.pubonline.title + ". ");
			str = str.concat("<i>" + root.website.title + ".</i> ");
			str = str.concat(root.pubonline.year + ". ");
			str = str.concat("Web. " + root.pubonline.dayaccessed + " ");
			str = str.concat(root.pubonline.monthaccessed + " ");
			str = str.concat(root.pubonline.yearaccessed + " ");
			var par = document.createElement('p');
			par.innerHTML = str;
			newDiv.appendChild(par);
			//console.log(str);
		}
		else{
			console.log("your article un-exCite-ing");
		}	
	}
}