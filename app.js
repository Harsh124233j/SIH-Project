const { OpenRouter } = require("@openrouter/sdk");
const Trip = require("./models/Trip");
const User = require("./models/User");
require("dotenv").config();
const { jsonrepair } = require("jsonrepair");
const mockData = require("./mockData.json");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const getPrompt = require("./getPrompt.js");
const path = require("path");
const methodOverride = require("method-override");
const NodeCache = require("node-cache");
const appCache = new NodeCache({stdTTL : 86400});
const { getWeatherAndPacking, getBookingLinks } = require("./bookingService.js");
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/sih-travel")
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("MongoDB Connection Error:", err));

let user_id, place, months, days;
// Home page work 
//hi
// Helper to extract userName from cookies manually
function getUserFromCookie(req) {
    if (req.headers.cookie) {
        const match = req.headers.cookie.match(/(?:^|; )userName=([^;]*)/);
        if (match) return decodeURIComponent(match[1]);
    }
    return null;
}

app.get('/', (req, res) => {
    res.render('home.ejs', { user: getUserFromCookie(req) });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'userName=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    res.redirect('/');
});
app.get('/aboutus', (req, res) => {
    res.render('about-us.ejs');
});

app.get('/offbeat', (req, res) => {
    res.render('offbeat.ejs', { user: getUserFromCookie(req) });
});

app.get("/guide", (req, res)=>{
    res.render("travel_tips.ejs");
})


// generator work 
app.get("/generator", (req, res)=>{
    res.render("generator.ejs");
})

// result showing
app.get("/showResults", (req, res)=>{
    let {selectedCity, selectedBudget} = req.query;
    res.render("result.ejs", {selectedCity, selectedBudget});
})

// ai-integration work


const openrouter = new OpenRouter({
  apiKey:
    process.env.MY_API_KEY,
});
let finalAns;


app.get("/showItinerary", (req, res)=>{
      if((Object.keys(req.query).length) === 0){
      console.log("Please select a valid date and place to visit !!");
      return res.send("404! Page not found");
    }
  res.render("show.ejs", {queryParams : req.query});
});

app.get("/mytrips", async (req, res) => {
    const userName = getUserFromCookie(req);
    if (!userName) {
        return res.redirect("/login"); // Agar login nahi hai toh wapas bhej dein
    }
    try {
        // Database se is user ki saari trips find karein (Latest pehle)
        const userTrips = await Trip.find({ userName: userName }).sort({ savedAt: -1 });
        
        res.render("mytrips.ejs", { trips: userTrips, user: userName });
    } catch (err) {
        console.error(err);
        res.send("Error loading your trips");
    }
});

app.get("/api/streamItinerary", async (req, res)=>{
  res.setHeader("Content-type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const location = "Prayagraj";
    let {place, month, days, noOfTravelers, budget, language} = req.query;

    // Cache Key Generate
    const cacheKey = `${place}_${days}_${month}_${noOfTravelers}_${budget}_${language}`.toLowerCase();
    //. Cache Check: Agar data mil jaye toh instantly return karein (0ms AI wait)
    if (appCache.has(cacheKey)) {
      const cachedData = appCache.get(cacheKey);
      res.write(`data: ${JSON.stringify({type : 'full', data : cachedData})}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    const conditions = `${place}  for ${days} days; arriving from ${location}, in ${month}; ${noOfTravelers} travelers; ${budget}.`;
    // getting prompt from other file 
    const request = getPrompt(conditions, language);

    //making the api call
    const completion = await openrouter.chat.send({
      chatRequest: {
        max_tokens: 4000,
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            // schema of the ai response 
            content:
              'You are a strict data-formatting API. Your only job is to generate a travel itinerary based on the user\'s constraints and return it strictly as a JSON object matching the exact schema provided below. Do not include conversational filler, greetings, or markdown code blocks outside the JSON.\n\n IMPORTANT: Write all descriptive text, summaries, and details in ${language}. BUT, keep all the JSON keys EXACTLY as they are in the schema below (in English). Only translate the string values.\n\n EXPECTED JSON SCHEMA:\n{\n  "trip_overview": "String - A short summary of the trip",\n  "transport_hubs": [\n    {\n      "hub_type": "String - Airport, Station, Bus Stand",\n      "name": "String",\n      "travel_to_main_destination": "String",\n      "estimated_fare": "String"\n    }\n  ],\n  "budget_estimate": {\n    "budget": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "mid_range": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "comfortable": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    }\n  },\n  "accommodations": [\n    {\n      "day": "Number",\n      "name": "String",\n      "type": "String - e.g., Homestay",\n      "price_per_night": "String",\n      "location": "String",\n      "facilities": ["String"],\n      "why_choose": "String",\n      "certifications_or_reviews": "String"\n    }\n  ],\n  "itinerary": [\n    {\n      "day": "Number",\n      "title": "String - Theme of the day",\n      "schedule": [\n        {\n          "time": "String - e.g., 09:00 AM - 11:30 AM",\n          "activity": "String",\n          "description": "String - Details including hidden gems"\n        }\n      ],\n      "artisan_experience": {\n        "workshop_name": "String - Verified name or type",\n        "craft_type": "String",\n        "authenticity_details": "String",\n        "practical_info": "String"\n      },\n      "travel_between_locations": [\n        {\n          "from": "String",\n          "to": "String",\n          "distance": "String",\n          "estimated_time": "String",\n          "recommended_mode": "String",\n          "options": [\n            {\n              "mode": "String - e.g., Local Bus, Private Taxi",\n              "fare": "String"\n            }\n          ]\n        }\n      ]\n    }\n  ],\n  "verification_notes": "String - Note which prices/times are official vs estimated",\n  "summary_table": [\n    {\n      "day": "Number",\n      "main_destination": "String",\n      "key_activities": "String",\n      "overnight_stay": "String"\n    }\n  ]\n}',
          },
          {
            role: "user",
            content: request,
          },
        ],
        stream: true,
      },
    });

    let fullRawString = "";
    for await(const chunk of completion){
      const textChunk = chunk.choices[0]?.delta?.content || "";
      if(textChunk){
        fullRawString += textChunk;
        process.stdout.write(textChunk);
        res.write(`data: ${JSON.stringify({type: 'chunk', text: textChunk})}\n\n`);
      }
    }

    const cleanString = fullRawString.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanString.match(/\{[\s\S]*\}/);

    if(jsonMatch){
      const repairedJson = jsonrepair(jsonMatch[0]);
      finalAns = JSON.parse(repairedJson);
      appCache.set(cacheKey, finalAns);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  }catch(err){
    console.error(err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: "Failed to generate." })}\n\n`);
    res.end();
  }
});


// Dedicated Real-Time Booking Page
app.get("/booking", (req, res) => {
  const { city = "Jaipur", budget = "moderate" } = req.query;
  res.render("booking.ejs", { selectedCity: city, selectedBudget: budget });
});

// Real-Time Booking Deep Links Generator (Skyscanner, Google Flights, Booking.com, IRCTC, RedBus)
app.get("/api/booking-options", (req, res) => {
  const { origin = "Prayagraj", destination = "Jaipur", hotel = "", hubType = "" } = req.query;
  const links = getBookingLinks({ origin, destination, hotelName: hotel, hubType });
  res.json(links);
});

app.post("/save-trip", async (req, res) => {
    // Cookie se user nikalna
    const userName = getUserFromCookie(req);
    if (!userName) {
        return res.status(401).send("Please login to save trips.");
    }
    const { place, days, month, noOfTravelers, budget } = req.body;
    
    // Wahi same Cache Key banayen jo api/streamItinerary mein banai thi
    const cacheKey = `${place}_${days}_${month}_${noOfTravelers}_${budget}`.toLowerCase();
    
    // Cache se generated JSON (finalAns) nikalein
    const generatedData = appCache.get(cacheKey);
    if (!generatedData) {
        return res.status(400).send("No itinerary found to save. Please generate again.");
    }
    try {
        // Naya Trip document banakar MongoDB mein save karein
        const newTrip = new Trip({
            userName: userName,
            place: place,
            days: days,
            month: month,
            budgetType: budget,
            itineraryData: generatedData
        });
        
        await newTrip.save();
        console.log("Trip saved successfully!");
        res.redirect("/mytrips"); // Save hone ke baad My Trips page par bhej dein
        
    } catch (err) {
        console.error("Error saving trip:", err);
        res.status(500).send("Error saving trip");
    }
});

// showing data for a particular day
app.get("/showItinerary/:day", (req, res) => {
    // if data for day 1 is called before generating itinerary then send to home
  if (!finalAns) {
    return res.send("404! Page not found");
  }
  let { day } = req.params;
  const dayNum = Number(day);
  let dayItinerary;
  let dayAccom;
  // finding itinerary of part day
  for (let portion of finalAns["itinerary"]) {
    if (portion["day"] === dayNum) {
      dayItinerary = portion;
    }
  }
  // finding accomodations of part day
  for (let accom of finalAns["accommodations"]) {
    if (accom["day"] === dayNum) {
      dayAccom = accom;
      break;
    }
  }

  // Generate real booking deep links for this day's accommodation and transit
  const destination = (dayAccom && dayAccom.location) ? dayAccom.location : "Jaipur";
  const hotelName = (dayAccom && dayAccom.name) ? dayAccom.name : "";
  const bookingLinks = getBookingLinks({ origin: "Prayagraj", destination, hotelName });
  
  // rendering details 
  res.render("showDetails.ejs", { dayItinerary, dayAccom, bookingLinks });
});

// 1. API route to Toggle (Add/Remove) Favorite via AJAX
app.post("/api/favorites/toggle", async (req, res) => {
    const userName = getUserFromCookie(req);
    if (!userName) return res.status(401).json({ error: "Please login first" });

    const { cityName, activityTitle, description } = req.body;

    try {
        // Pehle check karein ki kya ye jagah already user ki favorite hai?
        const existingFav = await Favorite.findOne({ userName, activityTitle });

        if (existingFav) {
            // Agar already hai, toh iska matlab user ne Heart (Un-favorite) kiya hai -> Delete kar do
            await Favorite.findByIdAndDelete(existingFav._id);
            return res.json({ message: "Removed from favorites", status: "removed" });
        } else {
            // Agar nahi hai, toh Naya Favorite Save kar do
            const newFav = new Favorite({ userName, cityName, activityTitle, description });
            await newFav.save();
            return res.json({ message: "Added to favorites", status: "added" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// 2. Wishlist Page Route (Jahan saare favorites dikhenge)
app.get("/wishlist", async (req, res) => {
    const userName = getUserFromCookie(req);
    if (!userName) return res.redirect("/login");

    try {
        const favorites = await Favorite.find({ userName }).sort({ savedAt: -1 });
        res.render("wishlist.ejs", { favorites, user: userName });
    } catch (err) {
        console.error(err);
        res.send("Error loading wishlist");
    }
});

app.listen(8080, () => {
    console.log(`Server listening on port 8080`);
});