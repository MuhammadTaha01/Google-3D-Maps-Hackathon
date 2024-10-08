async function initAutocomplete() {
    const { Autocomplete } = await google.maps.importLibrary("places");

    const autocomplete = new Autocomplete(
        document.getElementById("pac-input"),
        {
            fields: ["geometry", "name", "place_id"],
            strictBounds: false,
        }
    );

    /*
    When a new location is selected,
    returns either "No viewport for input",
    or changes center of map to new location.
    */
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.viewport) {
            window.alert("No viewport for input: " + place.name);
            return;
        }
        zoomToViewport(place.geometry);
    });
}

/*
Zooms to the location and puts a blue rectangle around it.
*/
const zoomToViewport = async (geometry) => {
    const { AltitudeMode, Polyline3DElement } = await google.maps.importLibrary(
        "maps3d"
    );
    let viewport = geometry.viewport;
    let locationPoints = [
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
    let locationPolyline = new Polyline3DElement({
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
        strokeColor: "blue",
        strokeWidth: 10,
        coordinates: locationPoints,
    });
    map3DElement.append(locationPolyline);
    console.log(locationPolyline);
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
};

/*
Returns elevation of location so viewport can be placed above it.
*/
async function getElevationforPoint(location) {
    const { ElevationService } = await google.maps.importLibrary("elevation");
    const elevatorService = new google.maps.ElevationService();
    const elevationResponse = await elevatorService.getElevationForLocations({
        locations: [location],
    });
    if (!(elevationResponse.results && elevationResponse.results.length)) {
        window.alert(`Insufficient elevation data for place: ${place.name}`);
        return;
    }
    const elevation = elevationResponse.results[0].elevation || 10;
    return elevation;
}

/*
Makes autocomplete try to complete inputs of a certain type.
*/
function setupClickListener(id, types) {
    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
        autocomplete.setTypes(types);
        input.value = "";
    });
}

/*
Calling setupClickListeners for each radio button
*/
setupClickListener("changetype-all", []);
setupClickListener("changetype-address", ["address"]);
setupClickListener("changetype-establishment", ["establishment"]);
setupClickListener("changetype-geocode", ["geocode"]);
setupClickListener("changetype-cities", ["(cities)"]);
setupClickListener("changetype-regions", ["(regions)"]);
