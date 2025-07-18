const socket = io();


if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending location:", latitude, longitude);
            socket.emit("send-location", { latitude, longitude });

            map.setView([latitude, longitude], 10
                
            );
            if (!userMarker) {
                userMarker = L.marker([latitude, longitude]).addTo(map);
            } else {
                userMarker.setLatLng([latitude, longitude]);
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}


const map = L.map("map").setView([0, 0], 10);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Poorvik © OpenStreetMap contributors"
}).addTo(map);


let userMarker = {};



socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (userMarker[id])
    {
        userMarker[id].setLatLng([latitude, longitude]);
    }
    else {
        userMarker[id]=L.marker([latitude,longitude]).addTo(map)
    }
});
socket.on("user-disconnected", (id) => {
    if (userMarker[id])
    {
        map.removeLayer(userMarker[id])
        delete userMarker[id]
         }
 })
