/*
  Mantis related functions
 */
 
var dataFields_de = ["Zusammenfassung", "Beschreibung", "Zusätzliche Information"];
var dataFields_en = ["Summary", "Description", "Additional Information"];

// find the actual ID column and returns its value
function findIDVal() {
	var items = document.getElementsByTagName("tr");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "row-1") {								
			return items[i].firstChild.innerText;
		}
	}
	
	return "";
}

// checks if the ID column exists
function IDColExists() {
	var items = document.getElementsByTagName("td");

	for (i=0; i < items.length; i++) {
		if (items[i].className == "category" && items[i].innerText == "ID") {								
			return true;
		}
	}
	
	return false;
}

// finds the Mantis ID and dispatches it back to the global page
function findMantisID() {
	console.log("find mantisID");
	if (IDColExists()) {
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

// iterates through "tr" tags and finds the column with the content matching the passed name
// it then returns the next column's content 
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

// finds the mantis data of the columns defined in dataFields_en/_de 
// and dispatches it back to the global page mantisissuesext.html
// Note: first German then English
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

/*
  Github issues related functions
 */

// inserts the data passed in the array into the "new github issue" page 
// data_array: 0 = title, 1 = description, 2 = additional info, 3 = ID, 4 = Mantis Issue URL
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

/*
  Common stuff
 */

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