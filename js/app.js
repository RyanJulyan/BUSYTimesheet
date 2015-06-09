var app = {
	data:{
		version:"0.0.1",
		curDate:new Date(),
		curAddress:'',
		username:"",
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		records:{},
		tags:{
			work:[],
			personal:[]
		}
	},
	editProperty:function(property, value){
		/*
		// Not working in time, Getting Duplicated Data
		if(typeof this.data[property] != "undefined"){
			this.data[property+"_old"] = this.data[property];
		}
		*/
		this.data[property] = value;
	},
	editSubProperty:function(property,subproperty, value){
		/*
		// Not working in time, Getting Duplicated Data
		if(typeof this.data[property][subproperty] != "undefined"){
			this.data[property][subproperty+"_old"] = this.data[property][subproperty];
		}
		*/
		this.data[property][subproperty] = value;
	},
	deleteProperty:function(property){
		delete this.data[property]
	},
	deleteSubProperty:function(property,subproperty){
		delete this.data[property][subproperty]
	},
	_ID:function(el){
		return document.getElementById(el);
	},
	_IDval:function(el, val){
		return document.getElementById(el).value = val;
	},
	_IDhtml:function(el, val){
		return document.getElementById(el).innerHTML = val;
	},
	isOnline:function(){
		return navigator.onLine;
	},
	setLocalStorage: function(key, val){
		localStorage.setItem(key, JSON.stringify(val));
	},
	getLocalStorage: function(key){
		localStorageVal = localStorage.getItem(key);
		try {
			if(JSON.parse(localStorageVal) != null){
				if(key == 'data'){
					return this.data = JSON.parse(localStorageVal);
				}
				else{
					return this.data[key] = JSON.parse(localStorageVal);
				}
			}
		}
		catch(err) {
			if(JSON.parse(localStorageVal) != null){
				return this.data[key] = localStorageVal;
			}
		}
	},
	displayAllStringMonths:function(id){
		var list = "";
		for(monthNo in this.data.monthNames){
			list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">' + this.data.monthNames[monthNo] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	getStringMonth:function(dateObj){
		var d = new Date(dateObj);
		return this.data.monthNames[d.getMonth()];
	},
	displayAllStringDays:function(id){
		var list = "";
		for(dayNo in this.data.dayNames){
			list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">' + this.data.dayNames[dayNo] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayAllTags:function(id){
		var list = "";
		for(obj in this.data.tags){
			list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">' + obj + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
			for(subObj in this.data.tags[obj]){
				list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">' + this.data.tags[obj][subObj] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
			
			}
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	getNumberOfDaysInMonth:function(year, month){
		var d = new Date(year, month, 0);
		return d.getDate();
	},	
	getMonthWeeks:function(year, month){
		var $num_of_days = this.getNumberOfDaysInMonth(year, month)
			,$num_of_weeks = 0
			,$start_day_of_week = 0;

		for(i=1; i<=$num_of_days; i++)
		{
		  var $day_of_week = new Date(year, month, i).getDay();
		  if($day_of_week==$start_day_of_week)
		  {
			$num_of_weeks++;
		  }   
		}

		return $num_of_weeks;
	},
	getAllWeeksDatesForYear: function(year){
		for(j=0;j<12;j++){
			var currMonthWeeks = this.getMonthWeeks(year, j);
			for(i=0;i<=currMonthWeeks;i++){
				weeksOfYear("",j,i);
			}
		}
	},
	ajaxRequest: function(address_url){
		xmlhttp={};
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}
		else{// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				try{
					ajaxData = JSON.parse(xmlhttp.responseText);
					return ajaxData;
				}
				catch(err){
					ajaxData = xmlhttp.responseText;
					return ajaxData;
				}
			}
		}
		xmlhttp.open("GET",address_url,true);
		xmlhttp.send();
	},
	stringAddress:function(data){
		for(arrIndex in data.results){
			if(data.results[arrIndex].types.indexOf('street_address') != -1){
				formatted_address = (data.results[0].formatted_address);
				this.data.curAddress = formatted_address;
				return this.data.curAddress;
			}
		}
		formatted_address = (data.results[0].formatted_address);
		this.data.curAddress = formatted_address;
		return this.data.curAddress;
	},
	getLocation:function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.getCurrentStringAddressURL, this.showError);
		} else {
			return "Geolocation is not supported by this browser.";
		}
	},
	getCurrentStringAddressURL:function(position) {
		var latlon = position.coords.latitude + "," + position.coords.longitude;
		currentAddress_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlon+"&key=AIzaSyCZNX3E_NcSikew5n7jfdEUMh9ctKGybA4";
	},
	showError:function(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
				break;
		}
	},
	addTag:function(parent, tag){
		if(parent == "uncategorised" || parent == ""){
			for(obj in this.data.tags){
				if(tag == obj){
					return "That TAG Already Exists";
				}
				else if(parent == obj){
					return "That TAG Already Exists";
				}
				for(subObj in this.data.tags[obj]){
					if(tag == this.data.tags[obj][subObj]){
						return "That TAG Already Exists";
					}
					else if(parent == this.data.tags[obj][subObj]){
						return "That TAG Already Exists";
					}
				}
			}
			if(tag in this.data.tags){
				return "That TAG Already Exists";
			}
			else{
				this.editSubProperty("tags", tag, []);
				this.setLocalStorage("data", this.data);
				return tag + " added to " + parent;
			}
		}
		else if(typeof this.data.tags[parent] === "undefined" && tag == ""){
			console.log(typeof this.data.tags[parent] === "undefined");
			for(obj in this.data.tags){
				if(tag == obj){
					return "That TAG Already Exists";
				}
				else if(parent == obj){
					return "That TAG Already Exists";
				}
				for(subObj in this.data.tags[obj]){
					if(parent == this.data.tags[obj][subObj]){
						return "That TAG Already Exists";
					}
				}
			}
			tags = [];
			this.editSubProperty("tags", parent, tags);
			this.setLocalStorage("data", this.data);
			return tag + " added to " + parent;
		}
		else {
			for(obj in this.data.tags){
				if(tag == obj){
					return "That TAG Already Exists";
				}
				for(subObj in this.data.tags[obj]){
					if(tag == this.data.tags[obj][subObj]){
						return "That TAG Already Exists";
					}
				}
			}
			
			if(tag != "" || typeof tag != "undefined"){
				this.editSubProperty("tags", parent, []);
			}
			
			tags = this.data.tags[parent];
			if(tags.indexOf(tag) == -1){
				tags.push(tag);
				this.editSubProperty("tags", parent, tags);
				this.setLocalStorage("data", this.data);
				return tag + " added to " + parent;
			}
			else{
				return "That TAG Already Exists";
			}
		}
	},
	displayTags:function(){
		for(obj in this.data.tags){
			console.log(obj);
			for(newObj in this.data.tags[obj]){
				console.log(this.data.tags[obj][newObj])
			}
		}
	},
	addRecord: function(project, record){
		this.data.curDate = new Date();
		this.data.lastTransactionID = this.data.curDate.getTime();
		if(typeof record == 'undefined' || record == ""){
			record = {};
		}
		if(typeof record.year == 'undefined'){
			record["year"] = this.data.curDate.getFullYear();
		}
		if(typeof record.month == 'undefined'){
			record["month"] = this.data.curDate.getMonth();
		}
		if(typeof record.day == 'undefined'){
			record["day"] = this.data.curDate.getDate();
		}
		if(typeof record.hours == 'undefined'){
			record["hours"] = this.data.curDate.getHours();
		}
		if(typeof record.minutes == 'undefined'){
			record["minutes"] = this.data.curDate.getMinutes();
		}
		record["monthString"] = this.data.monthNames[record["month"]];
		record["dayString"] = this.data.dayNames[record["day"]];
		if(typeof record.username == 'undefined' || record.username == "" || record.username == null){
			var guest = prompt("Please enter your username", "");
			if (guest != null) {
				record["username"] = guest;
				record["recordTimeID"] = this.data.lastTransactionID;
			}
			else{
				record["username"] = "Guest";
				record["recordTimeID"] = this.data.lastTransactionID;
			}
		}
		else{
			record["username"] = record["username"];
			record["recordTimeID"] = this.data.lastTransactionID;
		}
		
		var d = new Date(record.year, record.month, record.day, record.hours, record.minutes);
		record["dateString"] = d;
		if(project == "work" || project == ""){
			console.log(record.recordTimeID);
			if(record.recordTimeID in this.data.records){
				return "That record Already Exists";
			}
			else{
				project = "uncategorised";
				var obj = {};
				if(typeof this.data.records[project] != 'undefined'){
					obj = this.data.records[project];
				}
				obj[record.recordTimeID] = record;
				this.editSubProperty("records", project, obj);
				this.setLocalStorage("data", this.data);
				this.addTag("companies", project);
				return record.recordTimeID + " added to " + project;
			}
		}
		else if(typeof this.data.records[project] === "undefined"){
			var obj = {};
			obj[record.recordTimeID] = record;
			this.editSubProperty("records", project, obj);
			this.setLocalStorage("data", this.data);
			this.addTag("companies", project);
			return record.recordTimeID + " added to " + project;
		}
		else {
			var obj = {};
			obj = this.data.records[project];
			obj[record.recordTimeID] = record;
			this.editSubProperty("records", project, obj);
			this.setLocalStorage("data", this.data);
			this.addTag("companies", project);
			return record.recordTimeID + " added to " + project;
		}
	}
}

var inputTypeConfig = {
	pwd:{
		type: "password",
		placeholder: "Password"
	},
	txt:{
		type: "text",
		placeholder: ""
	},
	email:{
		type: "email",
		placeholder: "Email"
	},
	tel:{
		type: "tel",
		placeholder: ""
	},
	date:{
		type: "date",
		placeholder: ""	
	},
	datetime:{
		type: "datetime-local",
		placeholder: ""	
	},
	col:{
		type:"color",
		placeholder:"Colour"
	},
	range:{
		type:"range",
		placeholder:""
	}
}

function roughSizeOfObject( value, level ) {
    if(level == undefined) level = 0;
    var bytes = 0;

    if ( typeof value === 'boolean' ) {
        bytes = 4;
    }
    else if ( typeof value === 'string' ) {
        bytes = value.length * 2;
    }
    else if ( typeof value === 'number' ) {
        bytes = 8;
    }
    else if ( typeof value === 'object' ) {
        if(value['__visited__']) return 0;
        value['__visited__'] = 1;
        for( i in value ) {
            bytes += i.length * 2;
            bytes+= 8; // an assumed existence overhead
            bytes+= roughSizeOfObject( value[i], 1 )
        }
    }

    if(level == 0){
        clear__visited__(value);
    }
    return bytes;
}

function clear__visited__(value){
    if(typeof value == 'object'){
        delete value['__visited__'];
        for(var i in value){
            clear__visited__(value[i]);
        }
    }
}

function weeksOfYear(year, month, week){
	
	monthString = app.data.monthNames[month];
	
	firstDateOfMonth = new Date(year, month - 1, 1); // Date: year-month-01
	firstDayOfMonth = firstDateOfMonth.getDay();     // 0 (Sun) to 6 (Sat)
	firstDayOfMonthString = app.data.dayNames[firstDayOfMonth];
	firstDateOfWeek = new Date(firstDateOfMonth);    // copy firstDateOfMonth

	firstDateOfWeek.setDate(                             // move the Date object
		firstDateOfWeek.getDate() +                      // forward by the number of
		(firstDayOfMonth ? 7 - firstDayOfMonth : 0)      // days needed to go to
	);                                                   // Sunday, if necessary

	firstDateOfWeek.setDate(                             // move the Date object
		firstDateOfWeek.getDate() +                      // forward by the number of
		7 * (week - 1)                                   // weeks required (week - 1)
	);

	var dateNumbersOfMonthOnWeek = [];                   // output array of date #s
	var datesOfMonthOnWeek = [];                         // output array of Dates

	for (var i = 0; i < 7; i++) {                        // for seven days...

		dateNumbersOfMonthOnWeek.push(                   // push the date number on
			firstDateOfWeek.getDate());                  // the end of the array

		datesOfMonthOnWeek.push(                         // push the date object on
			new Date(+firstDateOfWeek));                 // the end of the array

		firstDateOfWeek.setDate(
			firstDateOfWeek.getDate() + 1);              // move to the next day

	}
	
	console.log(monthString);
	console.log(week);
	console.log(dateNumbersOfMonthOnWeek);
	
}