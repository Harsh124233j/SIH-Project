const mapDiv = document.getElementById("map");

if (mapDiv) {
  const travelRoutes = JSON.parse(mapDiv.dataset.travelRoutes || "[]");
  const apiKey = mapDiv.dataset.apiKey || "";

  if (travelRoutes.length > 0 && apiKey) {
    const origin = encodeURIComponent(`${travelRoutes[0].from}, India`);
    const destination = encodeURIComponent(`${travelRoutes[travelRoutes.length - 1].to}, India`);

    let waypoints = "";
    if (travelRoutes.length > 1) {
      const intermediateLocations = travelRoutes
        .slice(0, travelRoutes.length - 1)
        .map((route) => `${route.to}, India`);
      waypoints = `&waypoints=${intermediateLocations
        .map(encodeURIComponent)
        .join("|")}`;
    }

    const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}${waypoints}`;
    mapDiv.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${embedUrl}" allowfullscreen></iframe>`;
  } else {
    mapDiv.innerHTML =
      "<p style='text-align:center; padding: 2rem;'>No map data available.</p>";
  }
}