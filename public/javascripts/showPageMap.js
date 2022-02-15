mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

// Create a new marker.
const marker = new mapboxgl.Marker({
    color: "#FF451D",
    draggable: false
})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({
            offset: 25
        }).setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`)
    )
    .addTo(map);
