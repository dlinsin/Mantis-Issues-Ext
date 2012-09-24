/*
  Mantis related functions
 */
 
var dataFields_de = ["Zusammenfassung", "Beschreibung", "Zusätzliche Information", "Rechnertyp", "Betriebssystem", "BS-Version", "Produktversion", "Zielversion", "Reproduzierbar", "Priorität", "Auswirkung"];
var dataFields_en = ["Summary", "Description", "Additional Information", "Platform", "OS", "OS Version", "Product Version", "Target Version", "Reproducibility", "Priority", "Severity"];
var ctrl;
var t;
var s;


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
	shortcut.remove("Ctrl+Shift+M");
	console.log("find mantisID");
	if (IDColExists()) {
		console.log("found ID column");
		var mantisID = findIDVal();
		if (mantisID == "") {
			safari.self.tab.dispatchMessage("mantisID","not found");	
		} else {
			safari.self.tab.dispatchMessage("mantisID",mantisID);
			shortcut.add("Ctrl+Shift+M",function() {
				findMantisData();
			});	
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
			var cols = items[i].childNodes;
			for (j=0; j < cols.length; j++) {
			  var col = cols[j]
			  if (col.className == "category" && col.innerText == name) {								
				return col.nextSibling.innerText;
			  }
			}			
		}		
	}
	
	return "";
}

function addOverlay() {
	ctrl = getBusyOverlay("viewport", {color: 'black', opacity: 0.5, text: 'Copying...', style: 'font-weight: bold;font-family: Helvetica;color: black;'});
	t = setTimeout("ctrl.settext('Done!')", 400);
	s = setTimeout("ctrl.remove()", 600);
}

// finds the mantis data of the columns defined in dataFields_en/_de 
// and dispatches it back to the global page mantisissuesext.html
// Note: first German then English
function findMantisData() {
	console.log("find mantisData");
	addOverlay();
	var summary = findCol(dataFields_de[0]);
	if (summary != "") {
		data = [summary, findCol(dataFields_de[1]), findCol(dataFields_de[2]), findCol(dataFields_de[3]), findCol(dataFields_de[4]), findCol(dataFields_de[5]), findCol(dataFields_de[6]), findCol(dataFields_de[7]), findCol(dataFields_de[8]), findCol(dataFields_de[9]), findCol(dataFields_de[10])];
		safari.self.tab.dispatchMessage("mantisData",data);
		return;
	}  
	summary = findCol(dataFields_en[0]);
	if (summary != "") {
		data = [summary, findCol(dataFields_en[1]), findCol(dataFields_en[2]), findCol(dataFields_en[3]), findCol(dataFields_en[4]), findCol(dataFields_en[5]), findCol(dataFields_en[6]), findCol(dataFields_en[7]), findCol(dataFields_en[8]), findCol(dataFields_en[9]), findCol(dataFields_en[10])];
		safari.self.tab.dispatchMessage("mantisData",data);
		return;
	}
	safari.self.tab.dispatchMessage("mantisData",new Array());
}

/*
  Github issues related functions
 */

// inserts the data passed in the array into the "new github issue" page 
// data_array: 0 = title, 1 = description, 2 = additional info, 3 = Platform, 4 = OS, 5 = OS Version, 
//             6 = Product Version, 7 = Target Version, 8 = Reproducibility, 9 = Priority, 10 = Severity, 11 = ID, 12 = Mantis Issue URL
function insertMantisData(data_array) {
	document.getElementById("issue_title").focus();
	// set title
	document.getElementById("issue_title").value = data_array[0];
	// set body
	var desc_with_blockquote = data_array[1].replace(/\n\n/g, "\n\n>");
	var additional_info_with_blockquote = "\n\n> _Additional Information_:\n" + data_array[2];
    var platform_with_blockquote = "\n\n> _Platform_: " + data_array[3];
    var os_with_blockquote = "\n\n> _OS_: " + data_array[4];
    var os_version_with_blockquote = "\n\n> _OS Version_: " + data_array[5];
    var product_version_with_blockquote = "\n\n> _Product Version_: " + data_array[6];    
    var target_version_with_blockquote = "\n\n> _Target Version_: " + data_array[7];                
    var reproducibility_with_blockquote = "\n\n> _Reproducibility_: " + data_array[8];                
    var priority_with_blockquote = "\n\n> _Priority_: " + data_array[9];
    var severity_with_blockquote = "\n\n> _Severity_: " + data_array[10];                
	var body = "\n\n\n\n_Mantis Info_:\n\n>" + desc_with_blockquote + "\n\n>" + 
				additional_info_with_blockquote + 
				platform_with_blockquote + 
				os_with_blockquote + 
				os_version_with_blockquote +				
				product_version_with_blockquote +  
				target_version_with_blockquote +
				reproducibility_with_blockquote +
				priority_with_blockquote +
				severity_with_blockquote + 
				"\n\n>[ID: " + data_array[11] + "](" + data_array[12] + ")";
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
   		console.log("insertMantisData: " + theMessageEvent.message);
   		insertMantisData(theMessageEvent.message);   		
   	}
}

safari.self.addEventListener("message", performMessage, false);
shortcut.add("Ctrl+Shift+I",function() {
	safari.self.tab.dispatchMessage("performInsert","");
});	