var dataFields_de = ["Zusammenfassung", "Beschreibung", "Zusätzliche Information"];
var dataFields_en = ["Summary", "Description", "Additional Information"];

function findIDVal() {
	var items = document.getElementsByTagName("tr");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "row-1") {								
			return items[i].firstChild.innerText;
		}
	}
	
	return "";
}

function findIDCol() {
	var items = document.getElementsByTagName("td");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "category" && items[i].innerText == "ID") {								
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
			if (col.className == "category" && col.innerText == name) {								
				return col.nextSibling.innerText;
			}
		}		
	}
	
	return "";
}

function findMantisData() {
	console.log("find mantisData");
	var summary = findCol(dataFields_de[0]);
	if (summary != "") {
		data = [summary, findCol(dataFields_de[1]), findCol(dataFields_de[2])];
		safari.self.tab.dispatchMessage("mantisData",data);
		return;
	}  
	summary = findCol(dataFields_en[0]);
	if (summary != "") {
		data = [summary, findCol(dataFields_en[1]), findCol(dataFields_en[2])];
		safari.self.tab.dispatchMessage("mantisData",data);
		return;
	}
	safari.self.tab.dispatchMessage("mantisData",new Array());
}

function insertMantisData(data_array) {
	// set title
	var summary_without_id = data_array[0].substr(data_array[0].indexOf(":")+1).trim();
	document.getElementById("issue_title").value = summary_without_id;
	// set body
	var desc_with_blockquote = data_array[1].replace(/\n\n/g, "\n\n>");
	var additional_info_with_blockquote = data_array[2].replace(/\n\n/g, "\n\n>");
	var body = "\n\n\n\n_Mantis Info_:\n\n>" + desc_with_blockquote + "\n\n>" + 
				additional_info_with_blockquote + "\n\n>[ID: " + data_array[3] + "](" + data_array[4] + ")";
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