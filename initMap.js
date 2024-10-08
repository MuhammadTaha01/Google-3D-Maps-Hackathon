let map3DElement = null;
async function init() {
    const { Map3DElement } = await google.maps.importLibrary("maps3d");
    map3DElement = new Map3DElement({
        center: { lat: 0, lng: 0, altitude: 16000000 },
    });
    document.body.append(map3DElement);
    initAutocomplete();
}
