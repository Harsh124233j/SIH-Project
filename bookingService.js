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

// Seasonal Climate Norms for Indian Destination Regions by Month
const SEASONAL_CLIMATE_NORMS = {
  // Northern Plains & Desert (Jaipur, Agra, Delhi, Udaipur)
  north_plains: {
    january: { temp: 15, tempRange: "8°C - 22°C", condition: "Crisp Winter Sun", icon: "🌤️", isRainy: false, isCold: true, humidity: 48 },
    february: { temp: 19, tempRange: "11°C - 26°C", condition: "Pleasant Spring", icon: "☀️", isRainy: false, isCold: false, humidity: 42 },
    march: { temp: 25, tempRange: "17°C - 32°C", condition: "Warm & Sunny", icon: "☀️", isRainy: false, isCold: false, humidity: 32 },
    april: { temp: 31, tempRange: "23°C - 38°C", condition: "Hot & Dry", icon: "☀️", isRainy: false, isHot: true, humidity: 22 },
    may: { temp: 36, tempRange: "28°C - 42°C", condition: "Peak Summer Heat", icon: "🔥", isRainy: false, isHot: true, humidity: 24 },
    june: { temp: 35, tempRange: "28°C - 41°C", condition: "Hot with Pre-Monsoon Dust", icon: "🌤️", isRainy: false, isHot: true, humidity: 40 },
    july: { temp: 30, tempRange: "25°C - 35°C", condition: "Monsoon Showers", icon: "🌧️", isRainy: true, isHot: false, humidity: 72 },
    august: { temp: 29, tempRange: "24°C - 33°C", condition: "Humid & Rainy", icon: "🌦️", isRainy: true, isHot: false, humidity: 78 },
    september: { temp: 28, tempRange: "23°C - 34°C", condition: "Pleasant Post-Monsoon", icon: "🌤️", isRainy: false, isHot: false, humidity: 62 },
    october: { temp: 26, tempRange: "18°C - 33°C", condition: "Mild & Sunny", icon: "☀️", isRainy: false, isHot: false, humidity: 45 },
    november: { temp: 20, tempRange: "13°C - 28°C", condition: "Cool & Pleasant", icon: "🌤️", isRainy: false, isCold: false, humidity: 46 },
    december: { temp: 16, tempRange: "9°C - 23°C", condition: "Chilly Winter Evenings", icon: "❄️", isRainy: false, isCold: true, humidity: 52 }
  },
  // Coastal & Western/Southern (Goa, Mumbai, Kerala)
  coastal: {
    january: { temp: 26, tempRange: "20°C - 31°C", condition: "Sunny & Mild Sea Breeze", icon: "☀️", isRainy: false, isCold: false, humidity: 60 },
    february: { temp: 27, tempRange: "21°C - 32°C", condition: "Warm Beach Weather", icon: "☀️", isRainy: false, isCold: false, humidity: 62 },
    march: { temp: 29, tempRange: "23°C - 33°C", condition: "Warm & Tropical", icon: "🌤️", isRainy: false, isCold: false, humidity: 68 },
    april: { temp: 31, tempRange: "26°C - 34°C", condition: "Hot & Humid", icon: "☀️", isRainy: false, isHot: true, humidity: 72 },
    may: { temp: 32, tempRange: "27°C - 35°C", condition: "High Humidity & Pre-Monsoon", icon: "🌦️", isRainy: false, isHot: true, humidity: 76 },
    june: { temp: 28, tempRange: "24°C - 30°C", condition: "Heavy Monsoon Rains", icon: "🌧️", isRainy: true, isHot: false, humidity: 88 },
    july: { temp: 27, tempRange: "24°C - 29°C", condition: "Peak Monsoon Showers", icon: "⛈️", isRainy: true, isHot: false, humidity: 90 },
    august: { temp: 27, tempRange: "24°C - 29°C", condition: "Tropical Rain & Lush Greenery", icon: "🌧️", isRainy: true, isHot: false, humidity: 88 },
    september: { temp: 28, tempRange: "24°C - 31°C", condition: "Intermittent Sunshine & Showers", icon: "🌦️", isRainy: true, isHot: false, humidity: 82 },
    october: { temp: 29, tempRange: "24°C - 33°C", condition: "Warm Autumn Beach Weather", icon: "☀️", isRainy: false, isCold: false, humidity: 72 },
    november: { temp: 28, tempRange: "22°C - 33°C", condition: "Ideal Coastal Weather", icon: "☀️", isRainy: false, isCold: false, humidity: 65 },
    december: { temp: 26, tempRange: "20°C - 32°C", condition: "Peak Season Sunshine", icon: "☀️", isRainy: false, isCold: false, humidity: 62 }
  },
  // Himalayan & Hill Stations (Kashmir, Manali, Rishikesh, Shimla)
  himalayan: {
    january: { temp: 2, tempRange: "-4°C - 7°C", condition: "Sub-Zero & Heavy Snow", icon: "❄️", isRainy: true, isCold: true, humidity: 78 },
    february: { temp: 4, tempRange: "-2°C - 9°C", condition: "Snowy Winter", icon: "❄️", isRainy: true, isCold: true, humidity: 74 },
    march: { temp: 10, tempRange: "4°C - 16°C", condition: "Spring Thaw & Chilly", icon: "🌤️", isRainy: false, isCold: true, humidity: 65 },
    april: { temp: 15, tempRange: "8°C - 21°C", condition: "Pleasant Valley Blooms", icon: "🌸", isRainy: false, isCold: false, humidity: 55 },
    may: { temp: 19, tempRange: "11°C - 26°C", condition: "Warm & Sunny Mountain Days", icon: "☀️", isRainy: false, isCold: false, humidity: 50 },
    june: { temp: 23, tempRange: "14°C - 30°C", condition: "Warm Summer Mountain Weather", icon: "☀️", isRainy: false, isCold: false, humidity: 52 },
    july: { temp: 22, tempRange: "16°C - 28°C", condition: "Mountain Rains & Fog", icon: "🌧️", isRainy: true, isCold: false, humidity: 75 },
    august: { temp: 21, tempRange: "15°C - 27°C", condition: "Mist & Occasional Showers", icon: "🌫️", isRainy: true, isCold: false, humidity: 78 },
    september: { temp: 18, tempRange: "10°C - 25°C", condition: "Crisp Autumn Sunshine", icon: "🌤️", isRainy: false, isCold: false, humidity: 60 },
    october: { temp: 13, tempRange: "5°C - 20°C", condition: "Golden Autumn & Chilly Nights", icon: "🍂", isRainy: false, isCold: true, humidity: 58 },
    november: { temp: 8, tempRange: "1°C - 15°C", condition: "Early Winter Frost", icon: "❄️", isRainy: false, isCold: true, humidity: 62 },
    december: { temp: 4, tempRange: "-3°C - 9°C", condition: "Snowfall & Freezing Nights", icon: "❄️", isRainy: false, isCold: true, humidity: 72 }
  }
};

// Map city to climate zone
function getCityClimateZone(cityName) {
  const city = (cityName || "").toLowerCase();
  if (["goa", "mumbai", "kerala", "cochin", "kochi", "alleppey", "chennai", "pondicherry"].some(c => city.includes(c))) {
    return "coastal";
  }
  if (["manali", "kashmir", "srinagar", "shimla", "rishikesh", "ladakh", "leh", "dharamshala", "mussoorie", "darjeeling"].some(c => city.includes(c))) {
    return "himalayan";
  }
  return "north_plains"; // default: Jaipur, Agra, Delhi, Varanasi, Prayagraj, Udaipur, etc.
}

// Generate smart categorized packing recommendations based on weather, season, and destination
function generatePackingList(temp, weatherText, cityName = "", isRainy = false) {
  const clothing = [];
  const weatherGear = [];
  const footwear = [];
  const essentials = [];
  const culturalTips = [
    "Modest clothing covering knees and shoulders for shrines & temples",
    "Light shawl or scarf for head covering during sacred rituals"
  ];

  // Clothing by Temperature
  if (temp >= 32) {
    clothing.push("Lightweight loose cottons and breathable linens");
    clothing.push("Short-sleeved t-shirts and breathable casual wear");
    clothing.push("Light evening t-shirt or airy shirt");
    weatherGear.push("High-protection broad-spectrum SPF 50+ sunscreen");
    weatherGear.push("UV-protection polarized sunglasses");
    weatherGear.push("Wide-brimmed sun hat or breathable cap");
    essentials.push("Electrolyte hydration packets (ORS) for daytime heat");
    essentials.push("Double-walled insulated water bottle");
  } else if (temp >= 22 && temp < 32) {
    clothing.push("Comfortable cotton t-shirts, chinos, or linen trousers");
    clothing.push("Light denim jacket or light cardigan for breezy evenings");
    weatherGear.push("SPF 30+ sunscreen and sunglasses");
    weatherGear.push("Light scarf or bandanna for dust protection");
    essentials.push("Reusable water bottle");
  } else if (temp >= 12 && temp < 22) {
    clothing.push("Warm layers: light fleece pullover, sweater, or denim jacket");
    clothing.push("Long-sleeved cotton shirts and thermal base layer for nights");
    clothing.push("Light woolen muffler or warm stole");
    weatherGear.push("Moisturizing lip balm and cold cream");
    essentials.push("Thermos flask for hot tea/water during morning tours");
  } else {
    clothing.push("Heavy thermal innerwear (top & bottom)");
    clothing.push("Heavy down jacket, fleece pullover, or woolen coat");
    clothing.push("Woolen beanie, insulated gloves, and warm muffler");
    clothing.push("Thick woolen socks (2-3 pairs)");
    weatherGear.push("Cold-weather skin barrier cream & intensive lip balm");
    essentials.push("Pocket hand warmers");
    essentials.push("Vacuum-insulated thermos for warm liquids");
  }

  // Rain / Monsoon Protection
  const rainKeywords = ["rain", "shower", "thunder", "monsoon", "drizzle"];
  if (isRainy || rainKeywords.some(w => (weatherText || "").toLowerCase().includes(w))) {
    weatherGear.push("Compact windproof travel umbrella");
    weatherGear.push("Lightweight quick-dry waterproof rain poncho");
    weatherGear.push("Waterproof dry pouch for smartphone, passport, & cash");
    footwear.push("Water-resistant sandals with non-slip rubber grip");
  } else {
    footwear.push("Cushioned, breathable walking sneakers for heritage walks");
  }

  // Cultural Footwear & Health Essentials
  footwear.push("Easy slip-on footwear for frequent temple entrances");
  essentials.push("Compact power bank (10,000+ mAh) for all-day navigation");
  essentials.push("Travel first-aid kit with basic antacids, pain relief, & band-aids");
  essentials.push("Mosquito repellent cream or roll-on");

  // Flattened array for simple consumers
  const allList = [
    ...clothing,
    ...weatherGear,
    ...footwear,
    ...essentials,
    ...culturalTips
  ];

  return {
    clothing,
    weatherGear,
    footwear,
    essentials,
    culturalTips,
    allList
  };
}

/**
 * Fetch live weather and generate packing list for a city, target month, and optional date.
 * Integrates OpenWeatherMap API (if key present) with automatic fallback to Open-Meteo
 * and destination-specific monthly climate models.
 */
async function getWeatherAndPacking(cityName, targetMonth = "", travelDate = "") {
  const cleanCity = (cityName || "Jaipur").trim();
  const lowerCity = cleanCity.toLowerCase();
  let coords = KNOWN_COORDINATES[lowerCity];

  // If city coords not hardcoded, resolve via free geocoding
  if (!coords) {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`);
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
      console.warn("Geocoding lookup notice:", e.message);
    }
  }

  if (!coords) {
    coords = { lat: 26.9124, lon: 75.7873 }; // Jaipur fallback
  }

  // Determine month name (either passed directly or derived from date string)
  let month = (targetMonth || "").trim().toLowerCase();
  if (!month && travelDate) {
    const d = new Date(travelDate);
    if (!isNaN(d.getTime())) {
      const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
      month = monthNames[d.getMonth()];
    }
  }
  if (!month) {
    const currentMonthIdx = new Date().getMonth();
    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    month = monthNames[currentMonthIdx];
  }

  const climateZone = getCityClimateZone(cleanCity);
  const seasonalData = (SEASONAL_CLIMATE_NORMS[climateZone] && SEASONAL_CLIMATE_NORMS[climateZone][month])
    ? SEASONAL_CLIMATE_NORMS[climateZone][month]
    : SEASONAL_CLIMATE_NORMS.north_plains[month] || SEASONAL_CLIMATE_NORMS.north_plains.october;

  let liveTemp = null;
  let liveCondition = null;
  let liveIcon = null;
  let liveHumidity = null;
  let liveWindSpeed = null;
  let dataSource = "Seasonal Climate Norms";

  // 1. Try OpenWeatherMap API if OPENWEATHER_API_KEY is available in environment
  const openWeatherKey = process.env.OPENWEATHER_API_KEY;
  if (openWeatherKey) {
    try {
      const owmUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)},IN&units=metric&appid=${openWeatherKey}`;
      const owmRes = await fetch(owmUrl);
      if (owmRes.ok) {
        const owmData = await owmRes.json();
        liveTemp = Math.round(owmData.main.temp);
        liveHumidity = owmData.main.humidity;
        liveWindSpeed = Math.round((owmData.wind?.speed || 2) * 3.6); // m/s to km/h
        liveCondition = owmData.weather && owmData.weather[0] ? owmData.weather[0].main : "Clear";
        dataSource = "OpenWeatherMap Live API";
      }
    } catch (owmErr) {
      console.warn("OpenWeatherMap API lookup failed, falling back:", owmErr.message);
    }
  }

  // 2. Try Open-Meteo Live API if OpenWeatherMap was not available or failed
  if (liveTemp === null) {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
      const res = await fetch(weatherUrl);
      if (res.ok) {
        const data = await res.json();
        const current = data.current || {};
        liveTemp = Math.round(current.temperature_2m ?? 26);
        liveHumidity = current.relative_humidity_2m ?? 45;
        liveWindSpeed = Math.round(current.wind_speed_10m ?? 8);
        const weatherInfo = decodeWeatherCode(current.weather_code ?? 1);
        liveCondition = weatherInfo.text;
        liveIcon = weatherInfo.icon;
        dataSource = "Open-Meteo Live Forecast";
      }
    } catch (omErr) {
      console.warn("Open-Meteo API lookup notice:", omErr.message);
    }
  }

  // If planning for a different future month than current, harmonize live data with seasonal profile
  const currentMonthName = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"][new Date().getMonth()];
  const isFutureMonthPlan = (month !== currentMonthName);

  const finalTemp = isFutureMonthPlan ? seasonalData.temp : (liveTemp ?? seasonalData.temp);
  const finalCondition = isFutureMonthPlan ? seasonalData.condition : (liveCondition ?? seasonalData.condition);
  const finalIcon = isFutureMonthPlan ? seasonalData.icon : (liveIcon ?? seasonalData.icon);
  const finalHumidity = isFutureMonthPlan ? seasonalData.humidity : (liveHumidity ?? seasonalData.humidity);
  const finalWind = liveWindSpeed ?? 10;
  const isRainy = seasonalData.isRainy || (finalCondition.toLowerCase().includes("rain"));

  const packingAdvice = generatePackingList(finalTemp, finalCondition, cleanCity, isRainy);

  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const summaryText = isFutureMonthPlan
    ? `Expected climate in ${cleanCity} for ${formattedMonth}: Typically ${seasonalData.tempRange} with ${finalCondition.toLowerCase()}. Pack accordingly for this seasonal window.`
    : `Live forecast for ${cleanCity}: Currently ${finalTemp}°C with ${finalCondition.toLowerCase()} and ${finalHumidity}% humidity.`;

  return {
    city: cleanCity,
    month: formattedMonth,
    date: travelDate || null,
    temperature: finalTemp,
    tempRange: seasonalData.tempRange,
    condition: finalCondition,
    icon: finalIcon,
    humidity: finalHumidity,
    windSpeed: finalWind,
    isRainy,
    dataSource,
    summary: summaryText,
    packingTips: packingAdvice.allList, // backward compatibility
    categorizedPacking: {
      clothing: packingAdvice.clothing,
      weatherGear: packingAdvice.weatherGear,
      footwear: packingAdvice.footwear,
      essentials: packingAdvice.essentials,
      culturalTips: packingAdvice.culturalTips
    }
  };
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
