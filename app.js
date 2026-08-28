const { OpenRouter } = require("@openrouter/sdk");
require("dotenv").config();
const { jsonrepair } = require("jsonrepair");
const mockData = require("./mockData.json");
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const getPrompt = require("./getPrompt.js");
const path = require("path");
const methodOverride = require("method-override");
const NodeCache = require("node-cache");
const { text } = require("stream/consumers");
const appCache = new NodeCache({stdTTL : 86400});
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Home page work 

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
app.get('/aboutus', (req, res) => {
    res.render('about-us.ejs');
});

app.get('/offbeat', (req, res) => {
    res.render('offbeat.ejs', { user: getUserFromCookie(req) });
});

// generator work 
let loginSuccessfull = false;
app.get("/generator", (req, res)=>{
    // while(!loginSuccessfull){
    //     res.render("login.ejs", {loginSuccessfull});
    // }

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
  res.render("show.ejs", {queryParams : req.query});
});

app.get("/api/streamItinerary", async (req, res)=>{
  res.setHeader("Content-type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const location = "Prayagraj";
    const {place, month, days, noOfTravelers, budget} = req.query;

    // Cache Key Generate
    const cacheKey = `${place}_${days}_${month}_${noOfTravelers}_${budget}`.toLowerCase();
    //. Cache Check: Agar data mil jaye toh instantly return karein (0ms AI wait)
    if (appCache.has(cacheKey)) {
      const cachedData = appCache.get(cacheKey);
      res.write(`data: ${JSON.stringify({type : 'full', data : cachedData})}\n\n`);
      res.write("data: [DONE]\n\n");
      return res.end();
    }

    const conditions = `${req.query.place}  for ${req.query.days} days; arriving from ${location}, in ${req.query.month}; ${req.query.noOfTravelers} travelers; ${req.query.budget}.`;
    // getting prompt from other file 
    const request = getPrompt(conditions);

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
              'You are a strict data-formatting API. Your only job is to generate a travel itinerary based on the user\'s constraints and return it strictly as a JSON object matching the exact schema provided below. Do not include conversational filler, greetings, or markdown code blocks outside the JSON.\n\nEXPECTED JSON SCHEMA:\n{\n  "trip_overview": "String - A short summary of the trip",\n  "transport_hubs": [\n    {\n      "hub_type": "String - Airport, Station, Bus Stand",\n      "name": "String",\n      "travel_to_main_destination": "String",\n      "estimated_fare": "String"\n    }\n  ],\n  "budget_estimate": {\n    "budget": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "mid_range": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "comfortable": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    }\n  },\n  "accommodations": [\n    {\n      "day": "Number",\n      "name": "String",\n      "type": "String - e.g., Homestay",\n      "price_per_night": "String",\n      "location": "String",\n      "facilities": ["String"],\n      "why_choose": "String",\n      "certifications_or_reviews": "String"\n    }\n  ],\n  "itinerary": [\n    {\n      "day": "Number",\n      "title": "String - Theme of the day",\n      "schedule": [\n        {\n          "time": "String - e.g., 09:00 AM - 11:30 AM",\n          "activity": "String",\n          "description": "String - Details including hidden gems"\n        }\n      ],\n      "artisan_experience": {\n        "workshop_name": "String - Verified name or type",\n        "craft_type": "String",\n        "authenticity_details": "String",\n        "practical_info": "String"\n      },\n      "travel_between_locations": [\n        {\n          "from": "String",\n          "to": "String",\n          "distance": "String",\n          "estimated_time": "String",\n          "recommended_mode": "String",\n          "options": [\n            {\n              "mode": "String - e.g., Local Bus, Private Taxi",\n              "fare": "String"\n            }\n          ]\n        }\n      ]\n    }\n  ],\n  "verification_notes": "String - Note which prices/times are official vs estimated",\n  "summary_table": [\n    {\n      "day": "Number",\n      "main_destination": "String",\n      "key_activities": "String",\n      "overnight_stay": "String"\n    }\n  ]\n}',
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


// showing data for a particular day
app.get("/showItinerary/:day", (req, res) => {
    // if data for day 1 is called before generating itinerary then send to home 
  if (!finalAns) {
    return res.render("home.ejs");
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
  
  // rendering details 
  res.render("showDetails.ejs", { dayItinerary, dayAccom });
});



app.listen(8080, () => {
    console.log(`Server listening on port 8080`);
});