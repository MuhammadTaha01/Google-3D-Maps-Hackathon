// Function to get the static map image URL
function getStaticMapImageUrl(lat, lng, zoom = 14) {
    const apiKey = 'AIzaSyAM_HQJID095dTc6CwiPtjSHPHKcddpp4o'; // Make sure to use your actual API key - by Google Cloud Console
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&maptype=roadmap&key=${apiKey}`;
    return mapUrl;
}

// Event listener for sending the postcard
document.getElementById("sendPostcard").addEventListener("click", () => {
    const lat = 37.7749;  // Replace with actual latitude
    const lng = -122.4194; // Replace with actual longitude
    const staticMapUrl = getStaticMapImageUrl(lat, lng);

    // Show static map image in the modal
    const img = new Image();
    img.src = staticMapUrl;
    img.onload = () => {
        document.getElementById("screenshotImage").src = staticMapUrl;
        document.getElementById("screenshotModal").style.display = "flex";
        captureScreenshot(img);
    };
});
// Marker function to display the marker 

// marker function ends here

// chatbot starts here
  // Handle the question submission from the user
  // Sending the request to Flask backend
  // Handle chatbot request
 // Function to handle chatbot requests
function toggleChatbot() {
    const chatbotContainer = document.getElementById('chatbot-container');
    chatbotContainer.classList.toggle('open');
}

async function askChatbot(question) {
    const response = await fetch('http://127.0.0.1:5000/ask-chatbot', {  // Correct endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
    });

    const data = await response.json();
    if (data.error) {
        console.error("Error:", data.error);
    } else {
        // Display the chatbot response
        document.getElementById("chatbot-response").innerText = data.answer;
    }
}

// Attach event listener to the ask button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ask-question").addEventListener("click", () => {
        const userQuestion = document.getElementById("user-question").value;
        if (userQuestion) {
            askChatbot(userQuestion);
        }
    });
});
//chatbot ends here 
// Function to initialize the Google Maps Autocomplete
async function initAutocomplete() {
    const { Autocomplete } = await google.maps.importLibrary("places");
    const autocomplete = new Autocomplete(document.getElementById("pac-input"), {
        fields: ["geometry", "name", "place_id", "formatted_address", "photos", "rating"]
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("Please select a valid place.");
            return;
        }

        // Display place data
        displayPlaceData(place);
        zoomToViewport(place.geometry);
    });
}

// Function to display selected place data in the designated div
function displayPlaceData(place) {
    const locationInfoDiv = document.getElementById("location-info");
    locationInfoDiv.innerHTML = `
        <p><strong>Name:</strong> ${place.name || "N/A"}</p>
        <p><strong>Address:</strong> ${place.formatted_address || "N/A"}</p>
        <p><strong>Rating:</strong> ${place.rating || "N/A"}</p>
        <p><strong>Place ID:</strong> ${place.place_id}</p>
        <p><strong>Latitude:</strong> ${place.geometry?.location?.lat() || "N/A"}</p>
        <p><strong>Longitude:</strong> ${place.geometry?.location?.lng() || "N/A"}</p>
    `;
    if (place.photos && place.photos.length > 0) {
        const photoUrl = place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 });
        locationInfoDiv.innerHTML += `
            <p><strong>Photo:</strong></p>
            <img src="${photoUrl}" alt="Location photo" style="width:100%; height:200px;"/>
        `;
    } else {
        locationInfoDiv.innerHTML += `<p><strong>Photo:</strong> Not available</p>`;
    }
    
}

// Function to capture screenshot of the map image
function captureScreenshot(imgElement) {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden'; // Hide the container
    container.appendChild(imgElement);
    document.body.appendChild(container);

    html2canvas(container).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "postcard.png";
        link.click();

        // Clean up the container
        document.body.removeChild(container);
    });
}

// Close the modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("screenshotModal").style.display = "none";
});

// Function to zoom to the viewport and highlight the area
/* Zooms to the selected location and puts a blue rectangle around it. */
async function zoomToViewport(geometry) {
    const { AltitudeMode, Polyline3DElement } = await google.maps.importLibrary("maps3d");

    const viewport = geometry.viewport;
    const locationPoints = [
        {
            lat: viewport.getNorthEast().lat(),
            lng: viewport.getNorthEast().lng(),
        },
        {
            lat: viewport.getSouthWest().lat(),
            lng: viewport.getNorthEast().lng(),
        },
        {
            lat: viewport.getSouthWest().lat(),
            lng: viewport.getSouthWest().lng(),
        },
        {
            lat: viewport.getNorthEast().lat(),
            lng: viewport.getSouthWest().lng(),
        },
        {
            lat: viewport.getNorthEast().lat(),
            lng: viewport.getNorthEast().lng(),
        },
    ];

    const locationPolyline = new Polyline3DElement({
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
        strokeColor: "blue",
        strokeWidth: 10,
        coordinates: locationPoints,
    });
    map3DElement.append(locationPolyline);

    let elevation = await getElevationforPoint(geometry.location);
    if (map3DElement) {
        map3DElement.center = {
            lat: geometry.location.lat(),
            lng: geometry.location.lng(),
            altitude: elevation + 50,
        };
        map3DElement.heading = 0;
        map3DElement.range = 1000;
        map3DElement.tilt = 65;
    }
}

// Function to get elevation for the location
async function getElevationforPoint(location) {
    const { ElevationService } = await google.maps.importLibrary("elevation");
    const elevatorService = new google.maps.ElevationService();
    const elevationResponse = await elevatorService.getElevationForLocations({
        locations: [location],
    });
    if (!(elevationResponse.results && elevationResponse.results.length)) {
        window.alert("Insufficient elevation data for place: " + place.name);
        return;
    }
    const elevation = elevationResponse.results[0].elevation || 10;
    return elevation;
}


// Function to set up click listeners for filter types
function setupClickListener(id, types) {
    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
        input.value = "";
    });
}

// Setting up type filtering options
setupClickListener("changetype-all", []);
setupClickListener("changetype-address", ["address"]);
setupClickListener("changetype-establishment", ["establishment"]);
setupClickListener("changetype-geocode", ["geocode"]);
setupClickListener("changetype-cities", ["(cities)"]);
setupClickListener("changetype-regions", ["(regions)"]);