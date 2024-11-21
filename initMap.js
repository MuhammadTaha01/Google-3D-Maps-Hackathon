async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    map3DElement = new Map3DElement({
        center: { lat: 0, lng: 0, altitude: 16000000 },
    });
    document.body.append(map3DElement);
    initAutocomplete();
  }
  // marker this code doesnt work
  let map;
  
  // Initialize the map
  function initMap() {
  // Coordinates for the map center
  const location = { lat: -34.397, lng: 150.644 };
  
  // Create the map
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 8,
  });
  
  // Custom icon
  const customIcon = {
    url: 'https://your-image-url.com/custom-marker.png', // Your custom image URL
    size: new google.maps.Size(50, 50), // Size of the icon
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(25, 50), // Position of the icon relative to marker
  };
  
  // Create the marker
  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: customIcon, // Custom icon
    title: "Custom Marker", // Tooltip when hovering over the marker
  });
  
  // Optional: Add an info window
  const infowindow = new google.maps.InfoWindow({
    content: "<h3>Here is a custom marker</h3>",
  });
  
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  }
