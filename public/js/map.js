mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
   container: 'map', // container ID
   center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
   zoom: 11 // starting zoom
});


// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:'red'})
   .setLngLat(Listing.geometry.coordinates)
   .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(`<h5> ${Listing.title}  </h5>`)
      .setMaxWidth("300px")
   )
   .addTo(map);