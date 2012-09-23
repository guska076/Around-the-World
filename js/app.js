$(document).ready(function() {
	var lat = 49.299181, lon = 19.9495621, mq, pano_options, map_options, map;
	var mapDiv = document.getElementById('map'),markersArray = [], infowindow = new google.maps.InfoWindow(),
	places_types = ['store','airport','amusement_park','aquarium','art_gallery','atm','bar','bus_station','cafe','casino','food','grocery_or_supermarket',
	'lodging','museum','night_club','park','restaurant','spa','stadium','subway_station','train_station','zoo','natural_feature',
	'point_of_interest'
	];
	var panoramioPhotosView = true, googlePlacesView = false;
	map_options = {
		center: new google.maps.LatLng(lat, lon),
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		/*zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
		}*/
	};
	map = new google.maps.Map(mapDiv, map_options);
	var iconType = {};//color:709A36
	for(var i=0;i<places_types.length;i++) {
		iconType[places_types[i]] = "markers/"+places_types[i]+".png";
	}
	// check for Geolocation support
	function getLocation(callback)
	{
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				callback();
				markersNearby(lat,lon);
				googlePlacesView = true;
				$('input#places').attr('checked',true);
			},
			function(error) {
				var error_msg = '';
				switch(error.code)
				{
					case 0:
					error_msg = 'Unknown error';
					break;
					case 1:
					error_msg = 'Permission denied';
					break;
					case 2:
					error_msg = 'Position unavailable (error response from locaton provider)';
					break;
					case 3:
					error_msg = 'Timed out';
					break;
				}
				alert('Error occurred. '+error_msg);
				lat = 49.299181;
				lon = 19.9495621;
			});
		}
		else {
			lat = 49.299181;
			lon = 19.9495621;
			callback();
			alert('Geolocation is not supported for this Browser/OS version yet.');
		}
	}
	var panoramioLayer = new google.maps.panoramio.PanoramioLayer(), geocoder = new google.maps.Geocoder();
	panoramioLayer.setMap(map);
	getLocation(initApp);
	function initApp()
	{
		//getNearbyPhotos(lat,lon);
		//pano_options = {'rect': {'sw': {'lat': lat-0.002, 'lng': lon-0.002}, 'ne': {'lat': lat+0.002, 'lng': lon+0.002}}};
		map.setCenter(new google.maps.LatLng(lat, lon));
		google.maps.event.addListener(panoramioLayer, 'click', function(event) {
			//console.log(event);
		});
		//init panoramio widget
		//var photo_ex_options = {'width': w, 'height': h};
		//var photo_ex_widget = new panoramio.PhotoWidget('pano_photos', pano_options, photo_ex_options);
		//photo_ex_widget.setPosition(0);
	}
	function addMarker(place)
	{
		var rozmiar = new google.maps.Size(33,40);
		var punkt_startowy = new google.maps.Point(0,0);
		var punkt_zaczepienia = new google.maps.Point(16,16);
		var icon1 = new google.maps.MarkerImage(iconType[place.types[0]]?iconType[place.types[0]]:iconType[place.types[1]],rozmiar,punkt_startowy,punkt_zaczepienia);
		var opcjeMarkera =
		{
			position: place.geometry.location,
			map: map,
			icon: icon1
		}
		var marker = new google.maps.Marker(opcjeMarkera);
		markersArray.push(marker);
		google.maps.event.addListener(marker,"click",function()
		{
			infowindow.setContent('<h2>'+place.name+'</h2>'+place.vicinity);
			infowindow.open(map,marker);
		});
	}
	function markersNearby(lat,lng)
	{
		clearOverlays();
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
		}
	}
	//(lon-diff, lon+diff, lat-diff, lat+diff);
	function getNearbyPhotos(lat,lon) {
		$.ajax({
			url: 'http://www.panoramio.com/map/get_panoramas.php?set=full&from=0&to=20&minx='+(lon-0.002)+'&miny='+(lat-0.002)+'&maxx='+(lon+0.002)+'&maxy='+(lat+0.002)+'&size=medium&mapfilter=true',
			dataType: 'jsonp',
			success: function(data) {
				//console.log('http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20&minx='+(lat-0.002)+'&miny='+(lon-0.002)+'&maxx='+(lat+0.002)+'&maxy='+(lon+0.002)+'&size=medium&mapfilter=true');
			}
		});
	}
	
	$('input#photos').change(function() {
		if(panoramioPhotosView==true) {
			panoramioLayer.setMap(null);
			$(this).attr('checked',false);
			panoramioPhotosView = false;
		}
		else {
			panoramioLayer.setMap(map);
			$(this).attr('checked',true);
			panoramioPhotosView = true;
		}
	});
	$('input#places').change(function() {
		if(googlePlacesView==true) {
			clearOverlays();
			$(this).attr('checked',false);
			googlePlacesView = false;
		}
		else {
			showOverlays();
			$(this).attr('checked',true);
			googlePlacesView = true;
		}
	});
	//search places by input
	$('#search_place').on('click',function() {
		var place = $('#place').val();
		geocoder.geocode( {'address': place}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var geom_loc =results[0].geometry.location;
				map.setCenter(geom_loc);
				markersNearby(geom_loc.lat(),geom_loc.lng());
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});		
		return false;
	});
	
	function clearOverlays() {
		if (markersArray)
		{
			var markersArray_len = markersArray.length, i;
			for (i = 0; i < markersArray_len; i++) {
				markersArray[i].setMap(null);
			}
		}
	}
	function showOverlays() {
		if (markersArray)
		{
			var markersArray_len = markersArray.length, i;
			for (i = 0; i < markersArray_len; i++) {
				markersArray[i].setMap(map);
			}
		}
	}

}); 
