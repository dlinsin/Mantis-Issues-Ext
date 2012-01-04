function findIDVal() {
	var items = document.getElementsByTagName("tr");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "row-1") {								
			return items[i].firstChild.innerHTML;
		}
	}
	
	return "";
}

function findIDCol() {
	var items = document.getElementsByTagName("td");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "category" && items[i].innerHTML == "ID") {								
			return true;
		}
	}
	
	return false;
}

function findMantisID() {
	console.log("find mantisID");
	if (findIDCol()) {
		console.log("found ID column");
		var mantisID = findIDVal();
		if (mantisID == "") {
			safari.self.tab.dispatchMessage("mantisID","not found");	
		} else {
			safari.self.tab.dispatchMessage("mantisID",mantisID);	
		}
	} else {
		console.log("didn't find ID column");
		safari.self.tab.dispatchMessage("mantisID","not found");
	}
}

function performMessage(theMessageEvent) {
	console.log("message received");	
   	if (theMessageEvent.name === "mantisID") {
    	console.log("mantisID");
   		findMantisID();
   	}
}

safari.self.addEventListener("message", performMessage, false);