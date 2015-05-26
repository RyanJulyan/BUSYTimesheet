var app = {
	data:{
		version:"0.0.1",
		curDate:new Date(),
		curAddress:'',
		username:"",
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		records:{},
		tags:{}
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
		// this._IDhtml("monthList",list);
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	getStringMonth:function(dateObj){
		var d = new Date(dateObj);
		return this.data.monthNames[d.getMonth()];
		
		var list = "";
		for(monthNo in this.data.monthNames){
			list = list + "<li onclick='app.data.selectedMonth = this.innerHTML'>" + this.data.monthNames[monthNo] + "</li>";
		}
		this._IDhtml("monthList",list);
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
		console.log(this.data.tags);
		for(obj in this.data.tags){
			console.log(obj);
		}
		if(parent == "uncategorised" || parent == ""){
			if(tag in this.data.tags){
				return "That TAG Already Exists";
			}
			else{
				this.editSubProperty("tags", tag, []);
				this.setLocalStorage("data", this.data);
				return tag + " added to " + parent;
			}
		}
		else if(typeof this.data.tags[parent] === "undefined"){
			tags = [];
			tags.push(tag);
			this.editSubProperty("tags", parent, tags);
			this.setLocalStorage("data", this.data);
			return tag + " added to " + parent;
		}
		else {
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

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var d = new Date();
document.write("The current month is " + monthNames[d.getMonth()]);