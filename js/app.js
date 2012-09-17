$(document).ready(function() {
	var lat, lon, w, h, mq, pano_options, map_options, map;
	var mapDiv = document.getElementById('map'),markersArray = [], infowindow = new google.maps.InfoWindow(),
	places_types = ['store','airport','amusement_park','aquarium','art_gallery','atm','bar','bus_station','cafe','casino','food','grocery_or_supermarket',
	'lodging','museum','night_club','park','restaurant','spa','stadium','subway_station','train_station','zoo','natural_feature',
	'point_of_interest'
	];
	var iconType = {};//709A36
	for(var i=0;i<places_types.length;i++) {
		iconType[places_types[i]] = "markers/"+places_types[i]+".png";
	}
	//console.log(iconType);
	// check for Geolocation support
	function getLocation(callback)
	{
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				callback();
				markersNearby(lat,lon,'');
			});
		}
		else {
			lat = 49.299181;
			lon = 19.9495621;
			callback();
			//console.log('Geolocation is not supported for this Browser/OS version yet.');
			
		}
		
	}
	
	getLocation(initApp);
	function initApp()
	{
		
		pano_options = {'rect': {'sw': {'lat': lat-0.002, 'lng': lon-0.002}, 'ne': {'lat': lat+0.002, 'lng': lon+0.002}}};
		map_options = {
			center: new google.maps.LatLng(lat, lon),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(mapDiv, map_options);
		// media query event handler
		if (matchMedia) {
			var mq = window.matchMedia("(min-width: 800px)");
			mq.addListener(WidthChange);
			WidthChange(mq);
			$(window).resize(function() {
				WidthChange(mq);
				/* Refresh widget
				var photo_ex_options = {'width': w, 'height': h};
				var photo_ex_widget = new panoramio.PhotoWidget('pano_photos', pano_options, photo_ex_options);
				photo_ex_widget.setPosition(0);
				*/
			});
		}
		
		//init panoramio widget
		var photo_ex_options = {'width': w, 'height': h};
		var photo_ex_widget = new panoramio.PhotoWidget('pano_photos', pano_options, photo_ex_options);
		photo_ex_widget.setPosition(0);
	}
	function addMarker(place)
	{
		//console.log(place.types);
		var rozmiar = new google.maps.Size(33,40);
		var punkt_startowy = new google.maps.Point(0,0);
		var punkt_zaczepienia = new google.maps.Point(16,16);
		var icon1 = new google.maps.MarkerImage(iconType[place.types[0]]?iconType[place.types[0]]:iconType[place.types[1]],rozmiar,punkt_startowy,punkt_zaczepienia);
		var opcjeMarkera =
		{
			position: place.geometry.location,//new google.maps.LatLng(lat,lng),
			map: map,
			icon: icon1
			//icon: //icon1
		}
		var marker = new google.maps.Marker(opcjeMarkera);
		markersArray.push(marker);
		google.maps.event.addListener(marker,"click",function()
		{
			/*detail(refek,function(detale){
				marker.txt = '<div style="color:black;height:100px;"><a style="color:black;font-size:16px;font-weight:bold;" href="'+detale.result.url+'">'+detale.result.name+'</a><br />'+detale.result.formatted_address+'<br /> '+detale.result.formatted_phone_number+'</div>';
				dymek.setContent(marker.txt);
				dymek.open(map,marker);
			});*/
			infowindow.setContent('<h2>'+place.name+'</h2>'+place.vicinity);
			infowindow.open(map,marker);
		});
	}
	function markersNearby(lat,lng,icon)
	{
		/*$.ajax(file).done(function(dane){
			for(i=0;i<dane.results.length;i++)
			{
				var lat = parseFloat(dane.results[i].geometry.location.lat);
				var lng = parseFloat(dane.results[i].geometry.location.lng)
				addMarker(lat,lng,dane.results[i].id,dane.results[i].reference,icon);
			}
		});*/
		var request = {
			location: new google.maps.LatLng(lat,lng),
			radius: '1000',
			types: places_types
		};
		service = new google.maps.places.PlacesService(map);
		service.search(request, getNearbyResults);
	}
	function getNearbyResults(results, status, pagination) {
		clearOverlays();
		//console.log(pagination);
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for(var i = 0; i < results.length; i++) {
				addMarker(results[i]);
			}
		}
		else
		{
			if(status == google.maps.places.PlacesServiceStatus.ERROR) {
				console.log('There was a problem contacting the Google servers.');
			} 
			else if(status == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
				console.log('This request was invalid.');
			}
			else if(status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
				console.log('The webpage has gone over its request quota. Google places api limitations.');
			}
			else if(status == google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
				console.log('The webpage is not allowed to use the PlacesService.');
			}
			else if(status == google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
				console.log('The PlacesService request could not be processed due to a server error. The request may succeed if you try again.');
			}
			else if(status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
				console.log('Zero results.');
			}
			//console.log('Error '+status);
		}
	}
	// media query change
	function WidthChange(mq) {
		if (mq.matches) {
			// window width is at least 800px
			w = 800;
			h = 600;
		}
		else {
			// window width is less than 800px
			w = $(window).width();
			h = 600;
		}
	}
	function clearOverlays() {
		if (markersArray)
		{
			var markersArray_len = markersArray.length, i;
			for (i = 0; i < markersArray_len; i++) {
				markersArray[i].setMap(null);
			}
		}
	}
}); 
/*
geometry
	Object { location=P}
	
html_attributions
	[]
	
icon
	"http://maps.gstatic.com...cons/electronics-71.png"
	
id
	"c0f9bff3becd9470c98116cf4ed10cf2734d4c7d"
	
name
	"Salon Orange Łódź"
	
opening_hours
	Object { open_now=true}
	
reference
	"CoQBcgAAADckgIcXNjFXShM...dG3EpVIb-6jbHLgDK4Qnzag"
	
types
	["electronics_store", "store", "establishment"]
	
vicinity
	"Aleja Marszałka Józefa Piłsudskiego 3, Łódź"
*/
