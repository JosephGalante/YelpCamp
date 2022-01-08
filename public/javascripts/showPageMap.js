mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground_coords.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

// Create a new marker.
const marker = new mapboxgl.Marker({
    color: "#FF451D",
    draggable: false
})
    .setLngLat(campground_coords.geometry.coordinates)
    .addTo(map);
