/**
 * Booking Service & Travel Tools
 * Integrates Real Booking Links (Skyscanner, Google Flights, Booking.com, IRCTC, RedBus)
 * and Live Weather & Smart Packing Advisor (via Open-Meteo).
 */

const KNOWN_COORDINATES = {
  agra: { lat: 27.1767, lon: 78.0081 },
  delhi: { lat: 28.6139, lon: 77.2090 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  mumbai: { lat: 19.0760, lon: 72.8777 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  goa: { lat: 15.2993, lon: 74.1240 },
  kerala: { lat: 9.9312, lon: 76.2673 },
  prayagraj: { lat: 25.4358, lon: 81.8463 },
  udaipur: { lat: 24.5854, lon: 73.7125 },
  manali: { lat: 32.2432, lon: 77.1892 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  amritsar: { lat: 31.6340, lon: 74.8723 }
};

// Weather Code mapping for Open-Meteo WMO codes
function decodeWeatherCode(code) {
  if (code === 0) return { text: "Clear Sky", icon: "☀️" };
  if ([1, 2, 3].includes(code)) return { text: "Partly Cloudy", icon: "⛅" };
  if ([45, 48].includes(code)) return { text: "Foggy / Misty", icon: "🌫️" };
  if ([51, 53, 55, 61, 63, 65].includes(code)) return { text: "Rain Showers", icon: "🌧️" };
  if ([71, 73, 75, 77].includes(code)) return { text: "Snowfall", icon: "❄️" };
  if ([80, 81, 82].includes(code)) return { text: "Heavy Showers", icon: "🌦️" };
  if ([95, 96, 99].includes(code)) return { text: "Thunderstorm", icon: "⛈️" };
  return { text: "Pleasant", icon: "🌤️" };
}

// Generate smart packing recommendations based on weather and destination
function generatePackingList(temp, weatherText, city = "") {
  const items = [];

  // Temperature based
  if (temp >= 32) {
    items.push("Breathable loose cottons & linen");
    items.push("High SPF sunscreen & UV sunglasses");
    items.push("Sun hat or lightweight scarf");
    items.push("Reusable insulated water bottle");
  } else if (temp >= 20 && temp < 32) {
    items.push("Light casual clothing & breathable t-shirts");
    items.push("Comfortable walking sneakers / sandals");
    items.push("Light denim or evening jacket");
  } else if (temp >= 12 && temp < 20) {
    items.push("Warm layers & light sweaters / fleece");
    items.push("Comfortable closed-toe walking shoes");
    items.push("Moisturizer & lip balm");
  } else {
    items.push("Heavy winter jacket / thermal innerwear");
    items.push("Woolen cap, gloves & scarf");
    items.push("Insulated winter boots");
  }

  // Rain / Humidity based
  if (weatherText.toLowerCase().includes("rain") || weatherText.toLowerCase().includes("showers") || weatherText.toLowerCase().includes("thunder")) {
    items.push("Compact windproof umbrella");
    items.push("Quick-dry lightweight rain poncho");
    items.push("Waterproof pouch for phone & cash");
  }

  // Cultural & Sightseeing essentials for Indian heritage destinations
  items.push("Modest attire for temples & spiritual places");
  items.push("Easy slip-on footwear for temple entries");
  items.push("Hand sanitizer & basic first-aid essentials");

  return items;
}

/**
 * Fetch live weather and generate packing list for a city
 */
async function getWeatherAndPacking(cityName) {
  const cleanCity = (cityName || "Jaipur").trim().toLowerCase();
  let coords = KNOWN_COORDINATES[cleanCity];

  if (!coords) {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          coords = {
            lat: geoData.results[0].latitude,
            lon: geoData.results[0].longitude
          };
        }
      }
    } catch (e) {
      console.warn("Geocoding fallback failed:", e.message);
    }
  }

  if (!coords) {
    coords = { lat: 26.9124, lon: 75.7873 }; // Default to Jaipur
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(weatherUrl);
    if (!res.ok) throw new Error("Weather service unreachable");
    const data = await res.json();
    const current = data.current || {};
    const temp = Math.round(current.temperature_2m ?? 26);
    const humidity = current.relative_humidity_2m ?? 45;
    const weatherInfo = decodeWeatherCode(current.weather_code ?? 1);
    const packing = generatePackingList(temp, weatherInfo.text, cityName);

    return {
      city: cityName,
      temperature: temp,
      humidity,
      condition: weatherInfo.text,
      icon: weatherInfo.icon,
      packingTips: packing
    };
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    return {
      city: cityName,
      temperature: 26,
      humidity: 45,
      condition: "Pleasant",
      icon: "🌤️",
      packingTips: generatePackingList(26, "Pleasant", cityName)
    };
  }
}

const IATA_CODES = {
  prayagraj: "ixd",
  allahabad: "ixd",
  jaipur: "jai",
  delhi: "del",
  "new delhi": "del",
  mumbai: "bom",
  varanasi: "vns",
  goa: "goi",
  agra: "agr",
  kerala: "cok",
  kochi: "cok",
  udaipur: "udr",
  manali: "kuu",
  rishikesh: "ded",
  amritsar: "atq",
  bangalore: "blr",
  chennai: "maa",
  kolkata: "ccu",
  hyderabad: "hyd",
  pune: "pnq",
  lucknow: "lko",
  ahmedabad: "amd"
};

/**
 * Generate Real Booking Links for Flights, Trains, Buses, and Hotels
 */
function getBookingLinks({ origin = "Prayagraj", destination = "Jaipur", hotelName = "", hubType = "" }) {
  const oClean = origin.trim().toLowerCase();
  const dClean = destination.trim().toLowerCase();
  const encOrigin = encodeURIComponent(origin.trim());
  const encDest = encodeURIComponent(destination.trim());
  const encHotel = encodeURIComponent(hotelName ? `${hotelName} ${destination}` : `${destination} homestay`);

  const originIata = IATA_CODES[oClean] || "del";
  const destIata = IATA_CODES[dClean] || "jai";

  const skyscannerUrl = (IATA_CODES[oClean] && IATA_CODES[dClean])
    ? `https://www.skyscanner.co.in/transport/flights/${originIata}/${destIata}/`
    : `https://www.google.com/travel/flights?q=flights+from+${encOrigin}+to+${encDest}`;

  return {
    flights: {
      skyscanner: skyscannerUrl,
      googleFlights: `https://www.google.com/travel/flights?q=flights+from+${encOrigin}+to+${encDest}`,
      makemytrip: `https://www.makemytrip.com/flight/search?itinerary=${originIata.toUpperCase()}-${destIata.toUpperCase()}`
    },
    trains: {
      confirmtkt: `https://www.confirmtkt.com/trains/${encodeURIComponent(oClean)}-to-${encodeURIComponent(dClean)}-train-tickets`,
      irctc: `https://www.irctc.co.in/nget/train-search`,
      makemytripTrains: `https://www.makemytrip.com/railways/`
    },
    buses: {
      redbus: `https://www.redbus.in/bus-tickets/${encodeURIComponent(oClean)}-to-${encodeURIComponent(dClean)}`,
      abhibus: `https://www.abhibus.com/bus_search/${encodeURIComponent(oClean)}/${encodeURIComponent(dClean)}`
    },
    hotels: {
      bookingCom: `https://www.booking.com/searchresults.html?ss=${encHotel}`,
      googleHotels: `https://www.google.com/travel/hotels/${encDest}`,
      agoda: `https://www.agoda.com/search?text=${encHotel}`,
      makemytripHotels: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encDest}&searchText=${encHotel}`
    }
  };
}

module.exports = {
  getWeatherAndPacking,
  getBookingLinks
};
