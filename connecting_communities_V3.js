/* 

 @Author: Marina Lazaridou
 @Subject: Connecting Communities Mapping Project
 @File Format: JavaScript

*/

console.info("** Running communities map **");

	
function initMapLL(){
	console.log("initMapLL");
	
	// Create the map
	
	// Add basemaps layers
    
	var mapboxstreet = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyaW5hbGEiLCJhIjoiY2p0aDVvMm02MDd6bzQ0bnpqdjY3OHFrdCJ9.cY-gQZWm5ZYnCDy9lKHYLg', {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
	
	
	// Set the map properties
	var map = L.map('map', {
		center: [54.41892996865827, -3.4716796874999996],
		zoom: 5,
		minZoom: 1,
		maxZoom: 17,
		layers: [mapboxstreet]
	});
	
	mapboxstreet.addTo(map);
	
	
	// Add logo
	
	var mapControlsContainer = document.getElementsByClassName("leaflet-control")[0];
	var logoContainer = document.getElementById("logoContainer");
	mapControlsContainer.appendChild(logoContainer);

	// Add title
	
	var mapTitleContainer = document.getElementsByClassName("leaflet-control")[1];
	var mapTitle = document.getElementById("mapTitle");
	mapTitleContainer.appendChild(mapTitle);
	
	
	// Add scale bar
	
	L.control.scale({position: 'bottomleft'}).addTo(map);
	
	
	// Add search button
	
	map.addControl( new L.Control.Search({
		url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		jsonpParam: 'json_callback',
		propertyName: 'display_name',
		propertyLoc: ['lat','lon'],
		marker: L.circleMarker([0,0],{radius:30}),
		autoCollapse: true,
		autoType: false,
		minLength: 2
	}) );



	// Style the points
	
	var MarkerOptions = {
		radius: 8,
		fillColor: "#ff0000",
		color: "#ffffff",
		weight: 1.3,
		opacity: 0.8,
		fillOpacity: 0.9,
		opacity: 0.9
	};
		
	
		
	
	var points_layer = L.geoJSON(points_locations, {
		style: function(feature) {
			return {
				color: "#0c0c0c"
			};
		},
		pointToLayer: function(feature, latlng) {
			// return new L.marker(latlng, {
				// icon: icon
			// });
			return new L.CircleMarker(latlng, MarkerOptions);
		},
		onEachFeature: onEachFeature
	});
	
	// var icon = L.icon({
		// iconUrl: 'BRC_point_icon_small.png'
	// });
		
	
	// var BRC = L.geoJSON(points_locations, {
		// style: function(feature) {
			// return {
				// color: "#0c0c0c"
			// };
		// },
		// filter: function(feature, layer) {
			// return feature.properties.Name == "British Red Cross";
		// },
		// pointToLayer: function(feature, latlng) {
			// return new L.marker(latlng, {
				// icon: icon
			// });
		// },
		// onEachFeature: onEachFeature
	// });
	
	function highlightFeature(e) {
		var layer = e.target;
		layer.setStyle({
			weight: 3,
			color: 'yellow',
			fillOpacity: 1
			});
	}

	function show_info(e) {
		var layer = e.target;
		layer.setStyle({
			weight: 3,
			color: 'yellow',
			fillOpacity: 1
		});
		info_points.update(layer.feature.properties);
	}

	
	function resetHighlight(e) {
		points_layer.resetStyle(e.target),
		info_points.update();
	}
	
	
	function onEachFeature(feature, layer) {
		layer.on({
			click: show_info,
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
		layer.bindPopup(feature.properties.Name);
	}
						
	
	// Create clusters for the points
	
	var clusters = L.markerClusterGroup({
		showCoverageOnHover: false, 
		zoomToBoundsOnClick: false
		},
		{iconCreateFunction: function(cluster) {
			return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
		}
	});
	
	clusters.on('clusterclick', function (a) {
		a.layer.zoomToBounds();
	});

	clusters.addLayer(points_layer);
	map.addLayer(clusters);
		

			
	// Create an information div to show information about the points
	var info_points = L.control({position: 'topright'});
	
	info_points.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};
	
	info_points.update = function (props) {
		this._div.innerHTML = '<h4>Location Information</h4>' +  (props ?
			'<br>' + '<h5>'+props.Name+'</h5>' + '<br>' + '<br>' + 
			'<h3>Address: </h3>' + props.Address + '<br>' + '<br>' +'<h3>Phone: </h3>' + props.Phone + '<br>' + '<br>' + 
			'<h3>Hours: </h3>' + props.Opening_Hours + '<br>' + '<br>' + '<h3>Email: </h3>' + props.Email + '<br>' + '<br>'
			+ '<h3>Website: </h3>' + props.Website + '<br>' + '<br>' +
			'<h3>Wheelchair Access: </h3>' + props.Wheelchair_Access + '<br>' + '<br>'  +
			'<h3>Wheelchair Access Description: </h3>' + props.Wheelchair_Access_Description + '<br>' + '<br>'  +
			'<h3>WiFi: </h3>' + props.WiFi+ '<br>' + '<br>' +
			'<h3>Smoking Area: </h3>' + props.Smoking_Area + '<br>' + '<br>' +
			'<h3>Children Area: </h3>' + props.Children_Area+ '<br>'+ '<br>'  +
			'<h3>Outdoor Seating: </h3>' + props.Outdoor_Seating + '<br>' + '<br>' +
			'<h3>Food: </h3>' + props.Food + '<br>' + '<br>'  +
			'<h3>Cuisine: </h3>' + props.Cuisine + '<br>' + '<br>' +
			'<h3>Additional Comments: </h3>' + props.Additional_Comments + '<b>'
			: 'Click on a point')};
			
	

	// Add location
	L.control.locate().addTo(map);
	
	// Show information div
	info_points.addTo(map);
	// BRC.addTo(map);
	
	// points_layer.addTo(map);

	window.addEventListener('DOMContentLoaded', map);						
};


// End of script