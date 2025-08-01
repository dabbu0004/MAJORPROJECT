
	mapboxgl.accessToken = mapToken;    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        // style :"mapbox://style/mapbox/dark-v12",
        center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
    console.log(coordinates);

    const marker = new mapboxgl.Marker().setLngLat(coordinates).setPopup(new mapboxgl.Popup({ offSet:25}).setHTML(
        "<h3>Your destination </h3>"
    )).addTo(map);