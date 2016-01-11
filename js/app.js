var latlon;
var currentAddress_url;
var curAddress;
var ajaxData;
var startLatLon;
var endLatLon;
var app = {
	data:{
		version:"0.0.1",
		curDate:new Date(),
		googleAPIKey:'AIzaSyCZNX3E_NcSikew5n7jfdEUMh9ctKGybA4',
		curAddress:'',
		username:"",
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		monthsWeekSplit:{},
		weeksFromMonth:{},
		totalMonthTimes: {
			January:0, 
			February:0, 
			March:0, 
			April:0,
			May:0, 
			June:0, 
			July:0, 
			August:0, 
			September:0, 
			October:0, 
			November:0, 
			December:0
		},
		totalWeeksTimes:{January:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			February:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			March:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			April:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			},
			May:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			June:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			July:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			August:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			September:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			October:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			November:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}, 
			December:{
				0:0,
				1:0,
				2:0,
				3:0,
				4:0,
				5:0
			}
		},
		records:{},
		travel:{},
		tags:{
			"":"",
			Work:["Unplanned"],
			Personal:[],
			Other:[],
			Uncategorised:[]
		},
		clients:{
			"":[],
			Personal:[],
			uncategorised:[]
		},
		clientsTime:{}
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
		for(var monthName in this.data.totalMonthTimes){
			this.data.totalMonthTimes[monthName] = 0;
		}
		for(var companies in this.data.records){
			for(timeStamp in this.data.records[companies]){
				var monthString = this.data.records[companies][timeStamp].monthString;
				var hours = this.data.records[companies][timeStamp].hours;
				var monthTotal = this.data.totalMonthTimes[monthString];
				this.data.totalMonthTimes[monthString] = monthTotal + hours;
			}
		}
		var list = "";
		for(var monthName in this.data.monthsWeekSplit){
			list = list + '<li onclick="app.getWeeksFromMonth(\'' + monthName + '\')"><a href="#weeksFromMonthPage" data-transition="flow">' + monthName + '<span class="ui-li-count"><strong>'+ this.data.totalMonthTimes[monthName] +'</strong>hrs</span></a></li>';
			// console.log(this.data.monthsWeekSplit[monthName]);
			
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayWeeksOfMonth:function(id){
		// totalWeeksTimes
		for(var monthName in this.data.weeksFromMonth){
			var month = monthName;
		}
		for(var companies in this.data.records){
			for(timeStamp in this.data.records[companies]){
				var monthString = this.data.records[companies][timeStamp].monthString;
				if(monthString == month){
					for(var week in this.data.weeksFromMonth[month]){
						if(this.data.totalWeeksTimes[month][week] == 'undefined'){
							this.data.totalWeeksTimes[month] = {};
							this.data.totalWeeksTimes[month][week] = 0;
						}
						var weekTotal = this.data.totalWeeksTimes[month][week];
						// console.log(weekTotal);
						var hours = this.data.records[companies][timeStamp].hours;
						// console.log(hours);
						this.data.this.data.weeksFromMonth[month][week] = weekTotal + hours;
						// console.log(this.data.weeksFromMonth[month][week]);
					}
				}
			}
		}
		var list = "";
		for(var monthName in this.data.weeksFromMonth){
			for(var week in this.data.weeksFromMonth[monthName]){
				list = list + '<li onclick="app.getWeeksFromMonth(\'' + monthName + '\')"><a href="#">Week ' + week + ': ' + this.data.weeksFromMonth[monthName][week][0] + ' - ' + this.data.weeksFromMonth[monthName][week][6] + '<span class="ui-li-count"><strong>' + this.data.totalWeeksTimes[monthName][week] + '</strong>hrs</span></a></li>';
				// console.log(this.data.monthsWeekSplit[monthName]);
			}
			
		}
		$("#weeksFromMonth").html(monthName);
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayDaysOfTheWeek:function(id){
		// totalWeeksTimes
		for(var monthName in this.data.weeksFromMonth){
			var month = monthName;
		}
		for(var companies in this.data.records){
			for(timeStamp in this.data.records[companies]){
				var monthString = this.data.records[companies][timeStamp].monthString;
				if(monthString == month){
					for(var week in this.data.weeksFromMonth[month]){
						if(this.data.totalWeeksTimes[month][week] == 'undefined'){
							this.data.totalWeeksTimes[month] = {};
							this.data.totalWeeksTimes[month][week] = 0;
						}
						var weekTotal = this.data.totalWeeksTimes[month][week];
						// console.log(weekTotal);
						var hours = this.data.records[companies][timeStamp].hours;
						// console.log(hours);
						this.data.this.data.weeksFromMonth[month][week] = weekTotal + hours;
						// console.log(this.data.weeksFromMonth[month][week]);
					}
				}
			}
		}
		var list = "";
		for(var monthName in this.data.weeksFromMonth){
			for(var week in this.data.weeksFromMonth[monthName]){
				list = list + '<li onclick="app.getWeeksFromMonth(\'' + monthName + '\')"><a href="#">Week ' + week + ': ' + this.data.weeksFromMonth[monthName][week][0] + ' - ' + this.data.weeksFromMonth[monthName][week][6] + '<span class="ui-li-count"><strong>' + this.data.totalWeeksTimes[monthName][week] + '</strong>hrs</span></a></li>';
				// console.log(this.data.monthsWeekSplit[monthName]);
			}
			
		}
		$("#daysFromWeek").html(monthName);
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	getWeeksFromMonth:function(month){
		this.data.weeksFromMonth = {};
		this.data.weeksFromMonth[month] = {};
		this.data.weeksFromMonth[month] = app.data.monthsWeekSplit[month];
		return this.data.weeksFromMonth;
	},
	getStringMonth:function(dateObj){
		var d = new Date(dateObj);
		return this.data.monthNames[d.getMonth()];
	},
	displayAllStringDays:function(id){
		var list = "";
		for(var dayNo in this.data.dayNames){
			list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">' + this.data.dayNames[dayNo] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayAllTagsSelect:function(id){
		var list = "";
		for(var obj in this.data.tags){
			list = list + '<option><strong>' + obj + '</strong></option>';
			for(var subObj in this.data.tags[obj]){
				list = list + '<option>&nbsp;&nbsp;' + this.data.tags[obj][subObj] + '</option>';
			}
		}
		$("#"+id).html(list);
		$("#"+id).selectmenu("refresh");
	},
	displayAllTags:function(id){
		var list = "";
		for(var obj in this.data.tags){
			if(obj != ""){
				list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#"><strong>' + obj + '</strong><span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
				for(var subObj in this.data.tags[obj]){
					list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">&nbsp;&nbsp;&nbsp;' + this.data.tags[obj][subObj] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
				}
			}
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayAllClientsSelect:function(id){
		var list = "";
		for(var obj in this.data.clients){
			list = list + '<option><strong>' + obj + '</strong></option>';
			for(var subObj in this.data.clients[obj]){
				list = list + '<option>&nbsp;&nbsp;' + this.data.clients[obj][subObj] + '</option>';
			}
		}
		$("#"+id).html(list);
		$("#"+id).selectmenu("refresh");
	},
	displayAllClients:function(id){
		var list = "";
		for(var obj in this.data.clients){
			if(obj != ""){
				list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#"><strong>' + obj + '</strong><span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
				for(var subObj in this.data.clients[obj]){
					list = list + '<li onclick="app.data.selectedMonth = this.innerHTML"><a href="#">&nbsp;&nbsp;&nbsp;' + this.data.clients[obj][subObj] + '<span class="ui-li-count"><strong>0</strong>hrs</span></a></li>';
				}
			}
		}
		$("#"+id).html(list);
		$("#"+id).listview("refresh");
	},
	displayAllRecords:function(id){
		var list = "";
		var fullList = "";
		var totalClientHours = 0;
		for(var obj in this.data.records){
			for(var recordID in this.data.records[obj]){
				if(this.data.records[obj][recordID].billable == 'yes'){
					list = list + '<li><a href="#editRecord" data-rel="popup" data-position-to="window" data-transition="pop"><h2>' + this.data.records[obj][recordID].dateWorked + ' | ' + this.data.records[obj][recordID].dateWorkedTime + '</h2><p style="overflow: auto; white-space: inherit;"><strong>Note:</strong>'+ this.data.records[obj][recordID].notes +'</p><p><strong>Tags:</strong>'+ this.data.records[obj][recordID].tag + '</p><p style="float:left; /*border-style: solid; border-width: 1px;*/ padding: 3px 8px; background-color:#DEE0E0;"><strong>Billable</strong></p><span class="ui-li-count"><strong>' + this.data.records[obj][recordID].hoursWorked + '</strong>hrs</span></a><a href="#deleteRecord" data-rel="popup" data-position-to="window" data-transition="pop" data-theme="b" class="ui-shadow-icon ">Delete</a></li>';
				}
				else{
					list = list + '<li><a href="#editRecord" data-rel="popup" data-position-to="window" data-transition="pop"><h2>' + this.data.records[obj][recordID].dateWorked + ' | ' + this.data.records[obj][recordID].dateWorkedTime + '</h2><p style="overflow: auto; white-space: inherit;"><strong>Note:</strong>'+ this.data.records[obj][recordID].notes +'</p><p><strong>Tags:</strong>'+ this.data.records[obj][recordID].tag + '</p><span class="ui-li-count"><strong>' + this.data.records[obj][recordID].hoursWorked + '</strong>hrs</span></a><a href="#deleteRecord" data-rel="popup" data-position-to="window" data-transition="pop" data-theme="b" class="ui-shadow-icon ">Delete</a></li>';
				}
				totalClientHours = totalClientHours + parseInt(this.data.records[obj][recordID].hoursWorked);
			}
			this.data.clientsTime[obj] = totalClientHours;
			list = '<li data-role="list-divider">'+ obj +' <span class="ui-li-count">'+ totalClientHours +'</span></li>' + list;
			totalClientHours = 0;
			fullList = fullList + list;
			list = "";
		}
		$("#"+id).html(fullList);
		$("#"+id).listview("refresh");
	},
	displayAllTravel:function(id){
		var list = "";
		var fullList = "";
		var totalClientTravel = 0;
		for(var obj in this.data.travel){
			for(var recordID in this.data.travel[obj]){
				if(this.data.travel[obj][recordID].billable == 'yes'){
					list = list + '<li><a href="#editRecord" data-rel="popup" data-position-to="window" data-transition="pop"><h2>' + this.data.travel[obj][recordID].dateTraveled + ' </h2><p style="overflow: auto; white-space: inherit;"><strong>From:</strong> '+ this.data.travel[obj][recordID].startAddress +'</p><p style="overflow: auto; white-space: inherit;"><strong>To:</strong> '+ this.data.travel[obj][recordID].endAddress +'</p><p style="overflow: auto; white-space: inherit;"><strong>Note:</strong>'+ this.data.travel[obj][recordID].notes +'</p><p><strong>Tags:</strong>'+ this.data.travel[obj][recordID].tag + '</p><p style="float:left; /*border-style: solid; border-width: 1px;*/ padding: 3px 8px; background-color:#DEE0E0;"><strong>Billable</strong></p><span class="ui-li-count"><strong>' + this.data.travel[obj][recordID].distanceTravelled + '</strong>km</span></a><a href="#deleteRecord" data-rel="popup" data-position-to="window" data-transition="pop" data-theme="b" class="ui-shadow-icon ">Delete</a></li>';
				}
				else{
					list = list + '<li><a href="#editRecord" data-rel="popup" data-position-to="window" data-transition="pop"><h2>' + this.data.travel[obj][recordID].dateTraveled + ' </h2><p style="overflow: auto; white-space: inherit;"><strong>From:</strong> '+ this.data.travel[obj][recordID].startAddress +'</p><p style="overflow: auto; white-space: inherit;"><strong>To:</strong> '+ this.data.travel[obj][recordID].endAddress +'</p><p style="overflow: auto; white-space: inherit;"><strong>Note:</strong>'+ this.data.travel[obj][recordID].notes +'</p><p><strong>Tags:</strong>'+ this.data.travel[obj][recordID].tag + '</p><span class="ui-li-count"><strong>' + this.data.travel[obj][recordID].distanceTravelled + '</strong>km</span></a><a href="#deleteRecord" data-rel="popup" data-position-to="window" data-transition="pop" data-theme="b" class="ui-shadow-icon ">Delete</a></li>';
				}
				totalClientTravel = totalClientTravel + parseInt(this.data.travel[obj][recordID].distanceTravelled);
			}
			this.data.clientsTime[obj] = totalClientTravel;
			list = '<li data-role="list-divider">'+ obj +' <span class="ui-li-count">'+ totalClientTravel +'</span></li>' + list;
			totalClientTravel = 0;
			fullList = fullList + list;
			list = "";
		}
		$("#"+id).html(fullList);
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

		for(var i=1; i<=$num_of_days; i++)
		{
		  var $day_of_week = new Date(year, month, i).getDay();
		  if($day_of_week==$start_day_of_week)
		  {
			$num_of_weeks++;
		  }   
		}
		return $num_of_weeks;
	},
	weeksOfYear:function(year, month, week){
		monthString = this.data.monthNames[month-1];
		
		firstDateOfMonth = new Date(year, month - 1, 1); // Date: year-month-01
		firstDayOfMonth = firstDateOfMonth.getDay();     // 0 (Sun) to 6 (Sat)
		firstDayOfMonthString = this.data.dayNames[firstDayOfMonth];
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
		// console.log(week);
		// console.log(monthString + " Week " + week);
		// console.log(dateNumbersOfMonthOnWeek);
		return dateNumbersOfMonthOnWeek;
	},
	getAllWeeksDatesForYear: function(year){
		for(var j=1;j<=12;j++){
			var currMonthWeeks = this.getMonthWeeks(year, j);
			var monthString = this.data.monthNames[j-1];
			for(var i=0;i<=currMonthWeeks;i++){
				var month = this.data.monthsWeekSplit[monthString];
				if(typeof month == 'undefined'){
					this.data.monthsWeekSplit[monthString] = {}	
					month = this.data.monthsWeekSplit[monthString];
				}
				month[i] = this.weeksOfYear(year,j,i);
				// console.log(month[i]);
				this.editSubProperty("monthsWeekSplit",monthString, month);
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
			// console.log(currentAddress_url);
		} else {
			return "Geolocation is not supported by this browser.";
		}
	},
	getCurrentStringAddressURL:function(position) {
		latlon = position.coords.latitude + "," + position.coords.longitude;
		currentAddress_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlon+"&key="+app.data.googleAPIKey;
		// console.log(currentAddress_url);
		return currentAddress_url;
		// console.log(currentAddress_url);
	},
	getDistance(startLatLon,endLatLon){
		currentDistance_url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+startLatLon+"&destinations="+endLatLon+"&mode=driving&key="+app.data.googleAPIKey;
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
		// console.log(parent);
		// console.log(tag);
		if(parent == "uncategorised" || parent == ""){
			for(obj in this.data.tags){
				if(tag == obj){
					return "That TAG Already Exists";
				}
				// else if(parent == obj){
					// return "That TAG Already Exists";
				// }
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
			// console.log(typeof this.data.tags[parent] === "undefined");
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
			// console.log(this.data.tags);
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
			
			tags = this.data.tags[parent];
			
			if(typeof tags === "undefined"){
				tags = [];
			}
			
			if(tag != "" || typeof tag != "undefined"){
				this.editSubProperty("tags", parent, []);
			}
			
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
		setTimeout(function(){
			$( "#tagsPage" ).popup("close");
			this.displayAllTags("tagsList");
			this.displayAllTagsSelect("parentTag");
		}, 0.5);
	},
	addClient:function(parent, client){
		// console.log(parent);
		// console.log(client);
		if(parent == "uncategorised" || parent == ""){
			for(obj in this.data.clients){
				if(client == obj){
					return "That client Already Exists";
				}
				// else if(parent == obj){
					// return "That client Already Exists";
				// }
				for(subObj in this.data.clients[obj]){
					if(client == this.data.clients[obj][subObj]){
						return "That client Already Exists";
					}
					else if(parent == this.data.clients[obj][subObj]){
						return "That client Already Exists";
					}
				}
			}
			if(client in this.data.clients){
				return "That client Already Exists";
			}
			else{
				this.editSubProperty("clients", client, []);
				this.setLocalStorage("data", this.data);
				return client + " added to " + parent;
			}
		}
		else if(typeof this.data.clients[parent] === "undefined" && client == ""){
			// console.log(typeof this.data.clients[parent] === "undefined");
			for(obj in this.data.clients){
				if(client == obj){
					return "That client Already Exists";
				}
				else if(parent == obj){
					return "That client Already Exists";
				}
				for(subObj in this.data.clients[obj]){
					if(parent == this.data.clients[obj][subObj]){
						return "That client Already Exists";
					}
				}
			}
			clients = [];
			this.editSubProperty("clients", parent, clients);
			this.setLocalStorage("data", this.data);
			return client + " added to " + parent;
		}
		else {
			// console.log(this.data.clients);
			for(obj in this.data.clients){
				if(client == obj){
					return "That client Already Exists";
				}
				for(subObj in this.data.clients[obj]){
					if(client == this.data.clients[obj][subObj]){
						return "That client Already Exists";
					}
				}
			}
			
			clients = this.data.clients[parent];
			
			if(typeof clients === "undefined"){
				clients = [];
			}
			
			if(client != "" || typeof client != "undefined"){
				this.editSubProperty("clients", parent, []);
			}
			
			if(clients.indexOf(client) == -1){
				clients.push(client);
				this.editSubProperty("clients", parent, clients);
				this.setLocalStorage("data", this.data);
				return client + " added to " + parent;
			}
			else{
				return "That client Already Exists";
			}
		}
		setTimeout(function(){
			$( "#addClient" ).popup("close");
			this.displayAllclients("clientsList");
			this.displayAllclientsSelect("parentClient");
		}, 0.5);
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

		for(week in app.data.monthsWeekSplit[record["monthString"]]){
			
			var dayIndex = app.data.monthsWeekSplit[record["monthString"]][week].indexOf(record["day"]);
			if(dayIndex > 0){
				record["dayString"] = this.data.dayNames[dayIndex];
				
			}
		}
		//record["dayString"] = this.data.dayNames[record["day"]];
		if(typeof record.username == 'undefined' || record.username == "" || record.username == null){
			var guest = prompt("Please enter your username", "");
			if (guest != null) {
				record["username"] = guest;
				record["recordTimeID"] = this.data.lastTransactionID;
				this.data.username = guest;
			}
			else{
				record["username"] = "Guest";
				record["recordTimeID"] = this.data.lastTransactionID;
				this.data.username = "Guest";
			}
		}
		else{
			record["username"] = record["username"];
			record["recordTimeID"] = this.data.lastTransactionID;
			this.data.username = record["username"];
		}
		
		var d = new Date(record.year, record.month, record.day, record.hours, record.minutes);
		record["dateString"] = d;
		if(project == "work" || project == ""){
			// console.log(record.recordTimeID);
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
	},
	addTravel: function(project, record){
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

		for(week in app.data.monthsWeekSplit[record["monthString"]]){
			
			var dayIndex = app.data.monthsWeekSplit[record["monthString"]][week].indexOf(record["day"]);
			if(dayIndex > 0){
				record["dayString"] = this.data.dayNames[dayIndex];
				
			}
		}
		//record["dayString"] = this.data.dayNames[record["day"]];
		if(typeof record.username == 'undefined' || record.username == "" || record.username == null){
			var guest = prompt("Please enter your username", "");
			if (guest != null) {
				record["username"] = guest;
				record["recordTimeID"] = this.data.lastTransactionID;
				this.data.username = guest;
			}
			else{
				record["username"] = "Guest";
				record["recordTimeID"] = this.data.lastTransactionID;
				this.data.username = "Guest";
			}
		}
		else{
			record["username"] = record["username"];
			record["recordTimeID"] = this.data.lastTransactionID;
				this.data.username = record["username"];
		}
		
		var d = new Date(record.year, record.month, record.day, record.hours, record.minutes);
		record["dateString"] = d;
		if(project == "work" || project == ""){
			//console.log(record.recordTimeID);
			if(record.recordTimeID in this.data.travel){
				return "That record Already Exists";
			}
			else{
				project = "uncategorised";
				var obj = {};
				if(typeof this.data.travel[project] != 'undefined'){
					obj = this.data.travel[project];
				}
				obj[record.recordTimeID] = record;
				this.editSubProperty("travel", project, obj);
				this.setLocalStorage("data", this.data);
				this.addTag("companies", project);
				return record.recordTimeID + " added to " + project;
			}
		}
		else if(typeof this.data.travel[project] === "undefined"){
			var obj = {};
			obj[record.recordTimeID] = record;
			this.editSubProperty("travel", project, obj);
			this.setLocalStorage("data", this.data);
			this.addTag("companies", project);
			return record.recordTimeID + " added to " + project;
		}
		else {
			var obj = {};
			obj = this.data.travel[project];
			obj[record.recordTimeID] = record;
			this.editSubProperty("travel", project, obj);
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

function setFullAddress(elementID){
	$('#'+elementID).val(app.stringAddress(ajaxData));
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
	monthString = app.data.monthNames[month-1];
	
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
	// console.log(week);
	console.log(monthString + " Week " + week);
	console.log(dateNumbersOfMonthOnWeek);
	
}