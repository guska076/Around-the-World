$(document).ready(function() {
	var lat, lon, w, h, mq, pano_options, map_options, mapa;
	var mapDiv = document.getElementById('map');
	
	// check for Geolocation support
	function getLocation(callback)
	{
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				callback();
			});
		}
		else {
			lat = 49.299181;
			lon = 19.9495621;
			callback();
			//console.log('Geolocation is not supported for this Browser/OS version yet.');
			
		}
		
	}
	
	//var lat = -33.8669710, lon = 151.1958750, w, h;
	getLocation(initApp);
	function initApp()
	{
		
		pano_options = {'rect': {'sw': {'lat': lat-0.002, 'lng': lon-0.002}, 'ne': {'lat': lat+0.002, 'lng': lon+0.002}}};
		map_options = {
			center: new google.maps.LatLng(lat, lon),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		mapa = new google.maps.Map(mapDiv, map_options);
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
}); 
