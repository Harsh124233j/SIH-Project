const { OpenRouter } = require("@openrouter/sdk");
const Trip = require("./models/Trip");
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
const appCache = new NodeCache({ stdTTL: 86400 });
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

app.get('/emergency', (req, res) => {
  res.render('emergency.ejs', { user: getUserFromCookie(req) });
});

app.get("/guide", (req, res) => {
  res.render("travel_tips.ejs");
})


// generator work 
app.get("/generator", (req, res) => {
  res.render("generator.ejs");
})

// result showing
app.get("/showResults", (req, res) => {
  let { selectedCity, selectedBudget } = req.query;
  res.render("result.ejs", { selectedCity, selectedBudget });
})

// ai-integration work


const openrouter = new OpenRouter({
  apiKey:
    process.env.MY_API_KEY,
});
let finalAns;


app.get("/showItinerary", (req, res) => {
  if ((Object.keys(req.query).length) === 0) {
    console.log("Please select a valid date and place to visit !!");
    return res.send("404! Page not found");
  }
  res.render("show.ejs", { queryParams: req.query });
});


app.get("/api/streamItinerary", async (req, res) => {
  res.setHeader("Content-type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const location = "Prayagraj";
    const {place, month, days, noOfTravelers, budget, language} = req.query;
    
    // Cache Key Generate
    const cacheKey = `${place}_${days}_${month}_${noOfTravelers}_${budget}_${language}`.toLowerCase();
    //. Cache Check: Agar data mil jaye toh instantly return karein (0ms AI wait)
    if (appCache.has(cacheKey)) {
      const cachedData = appCache.get(cacheKey);
      res.write(`data: ${JSON.stringify({ type: 'full', data: cachedData })}\n\n`);
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
            content: `You are a strict data-formatting API. Your only job is to generate a travel itinerary based on the user's constraints and return it strictly as a JSON object matching the exact schema provided below. Do not include conversational filler, greetings, or markdown code blocks outside the JSON.
DO NOT explain your reasoning. DO NOT use <think> tags. Directly output the JSON and nothing else.            
IMPORTANT: Write all descriptive text, summaries, and details in ${language}. BUT, keep all the JSON keys EXACTLY as they are in the schema below (in English). Only translate the string values. Keep all translated descriptions concise (under 2 sentences) to ensure fast generation.
EXPECTED JSON SCHEMA:
{
  "trip_overview": "String - A short summary of the trip",
  "transport_hubs": [
    {
      "hub_type": "String - Airport, Station, Bus Stand",
      "name": "String",
      "travel_to_main_destination": "String",
      "estimated_fare": "String"
    }
  ],
  "budget_estimate": {
    "budget": {
      "accommodation": "String",
      "local_transport": "String",
      "intercity_transport": "String",
      "entry_tickets": "String",
      "food": "String",
      "misc": "String",
      "total": "String"
    },
    "mid_range": {
      "accommodation": "String",
      "local_transport": "String",
      "intercity_transport": "String",
      "entry_tickets": "String",
      "food": "String",
      "misc": "String",
      "total": "String"
    },
    "comfortable": {
      "accommodation": "String",
      "local_transport": "String",
      "intercity_transport": "String",
      "entry_tickets": "String",
      "food": "String",
      "misc": "String",
      "total": "String"
    }
  },
  "accommodations": [
    {
      "day": "Number",
      "name": "String",
      "type": "String - e.g., Homestay",
      "price_per_night": "String",
      "location": "String",
      "facilities": ["String"],
      "why_choose": "String",
      "certifications_or_reviews": "String"
    }
  ],
  "itinerary": [
    {
      "day": "Number",
      "title": "String - Theme of the day",
      "schedule": [
        {
          "time": "String - e.g., 09:00 AM - 11:30 AM",
          "activity": "String",
          "description": "String - Details including hidden gems"
        }
      ],
      "artisan_experience": {
        "workshop_name": "String - Verified name or type",
        "craft_type": "String",
        "authenticity_details": "String",
        "practical_info": "String"
      },
      "travel_between_locations": [
        {
          "from": "String",
          "to": "String",
          "distance": "String",
          "estimated_time": "String",
          "recommended_mode": "String",
          "options": [
            {
              "mode": "String - e.g., Local Bus, Private Taxi",
              "fare": "String"
            }
          ]
        }
      ]
    }
  ],
  "verification_notes": "String - Note which prices/times are official vs estimated",
  "summary_table": [
    {
      "day": "Number",
      "main_destination": "String",
      "key_activities": "String",
      "overnight_stay": "String"
    }
  ]
}`,
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
    for await (const chunk of completion) {
      const textChunk = chunk.choices[0]?.delta?.content || "";
      if (textChunk) {
        fullRawString += textChunk;
        process.stdout.write(textChunk);
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: textChunk })}\n\n`);
      }
    }

    const cleanString = fullRawString.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const jsonMatch = cleanString.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const repairedJson = jsonrepair(jsonMatch[0]);
      finalAns = JSON.parse(repairedJson);
      appCache.set(cacheKey, finalAns);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: "Failed to generate." })}\n\n`);
    res.end();
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
  res.render("showDetails.ejs", { dayItinerary, dayAccom, bookingLinks, MAP_API_KEY: process.env.MAP_API_KEY });
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

app.get("/myTrips", async (req, res) => {
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


app.post("/save-trip", async (req, res) => {
    // Cookie se user nikalna
    const userName = getUserFromCookie(req);
    if (!userName) {
        return res.status(401).send("Please login to save trips.");
    }
    const { place, days, month, noOfTravelers, budget , language} = req.body;
    
    // Wahi same Cache Key banayen jo api/streamItinerary mein banai thi
    const cacheKey = `${place}_${days}_${month}_${noOfTravelers}_${budget}_${language}`.toLowerCase();
    
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
        res.redirect("/myTrips"); // Save hone ke baad My Trips page par bhej dein
        
    } catch (err) {
        console.error("Error saving trip:", err);
        res.status(500).send("Error saving trip");
    }
});

app.get("/myTrips", (req, res)=>{
  const {place, month, days, noOfTravelers, budget, language} = req.query;

  res.render("myTrips.ejs");
})

app.get("/myTrips/saved/:id", async (req, res)=>{
  try{
    let {id} = req.params;
    const trip = await Trip.findById(id);
    if(!trip){
      return res.send("Trip not found");
    }
    finalAns = trip.itineraryData;
    res.render("show.ejs", {savedItinerary : trip.itineraryData, queryParams : {place : trip.place, days : trip.days}});
  }catch(err){
    res.send("Error loading trip");
  }
})

app.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});