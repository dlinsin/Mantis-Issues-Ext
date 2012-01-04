var dataFields_de = ["Zusammenfassung", "Beschreibung", "Zusätzliche Information"];
var dataFields_en = ["Summary", "Description", "Additional Information"];

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

function findCol(name) {
	var items = document.getElementsByTagName("tr");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "row-1" || items[i].className == "row-2") {
			var col = items[i].firstChild; 
			if (col.className == "category" && col.innerHTML == name) {								
				return col.nextSibling.innerHTML;
			}
		}		
	}
	
	return "";
}

function findMantisData() {
	console.log("find mantisData");
	// TODO language
	var data = [findCol(dataFields_de[0]), findCol(dataFields_de[1]), findCol(dataFields_de[2])];
	safari.self.tab.dispatchMessage("mantisData",data);
}

function insertMantisData(data_array) {
	var summary_without_id = data_array[0].substr(data_array[0].indexOf(":")+1).trim();
	document.getElementById("issue_title").value = summary_without_id;
	var body = "\n\n\n\n>_Mantis Info_:\n\n>" + data_array[1] + "\n\n>" + data_array[2] + "\n\n>[ID: " + data_array[3] + "](" + data_array[4] + ")";
	document.getElementsByTagName("textarea")[0].value = body;	
}

function performMessage(theMessageEvent) {
	console.log("message received");	
   	if (theMessageEvent.name === "mantisID") {
    	console.log("mantisID");
   		findMantisID();
   	} else if (theMessageEvent.name === "mantisData") {
   		console.log("mantisData");
   		findMantisData();   		
   	} else if (theMessageEvent.name === "insertMantisData") {
   		console.log("insertMantisData");
   		insertMantisData(theMessageEvent.message);   		
   	}
}

safari.self.addEventListener("message", performMessage, false);