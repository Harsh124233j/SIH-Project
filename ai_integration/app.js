const { OpenRouter } = require("@openrouter/sdk");
require("dotenv").config();
const { jsonrepair } = require("jsonrepair");
const mockData = require("./mockData.json");
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const openrouter = new OpenRouter({
  apiKey:
    "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",
});
let finalAns;

app.get("/", (req, res) => {
  res.send("root is working");
});

app.get("/showItenary", async (req, res) => {
  try {
    const place = "Jaipur",
      location = "Patna",
      month = "October",
      noOfTravelers = 4,
      days = 5,
      price_range = "Luxury";
    const conditions = `${place}  for ${days} days; arriving from ${location}, in ${month}; ${noOfTravelers} travelers; ${price_range}.`;
    const request = `I am planning a small tour of **${conditions}**. Create a detailed, practical, and well-structured **day-by-day travel itinerary** for me.

Please follow these requirements:

1. **Day-wise itinerary:** Plan each day from morning to night, including suggested timings and the best order to visit places to minimize unnecessary travel.

2. **Popular + lesser-known places:** Do not limit the itinerary to famous tourist attractions, forts, or major landmarks. Also include **nearby hidden gems, lesser-known historical sites, villages, natural spots, local markets, cultural places, and other interesting attractions** that are genuinely worth visiting.

3. **Local artisan experiences:** Wherever possible, pair attractions with a **verified local artisan's workshop or authentic craft experience**, such as pottery, weaving, painting, metalwork, textiles, handicrafts, etc. Mention what makes the experience authentic and provide practical visiting information.

4. **Homestays and accommodation:** Recommend **reputable, locally run homestays** or other suitable accommodation options. Prefer properties with reliable reviews and recognized certifications, registrations, or credible tourism affiliations where such information is available.

5. **Travel between locations:** For every journey from one place to another, provide:

   * Distance
   * Estimated travel time
   * Available modes of transportation
   * Recommended mode of transport
   * Approximate fare for each available option
   * Whether a private taxi, local bus, train, auto-rickshaw, rental vehicle, or other option is available

6. **Nearby transport facilities:** Mention the **nearest bus stands, railway stations, airports, and other important transport hubs** relevant to the itinerary. Also explain how to travel from these hubs to the main destinations and provide estimated fares.

7. **Accommodation details:** For each recommended stay, mention:

   * Approximate price per night
   * Location
   * Type of accommodation
   * Key facilities
   * Why it is a good choice for that day's itinerary

8. **Budget estimate:** Provide an estimated total budget for the entire trip, with separate approximate costs for:

   * Accommodation
   * Local transportation
   * Intercity transportation
   * Entry tickets and activities
   * Food
   * Miscellaneous expenses

9. **Different budget options:** If possible, provide **Budget, Mid-range, and Comfortable** travel options.

10. **Verification and accuracy:** Use the most recent and reliable information available. Clearly distinguish between **officially verified information** and **estimated costs or travel times**. Avoid inventing businesses, workshops, certifications, transport services, or prices. If any information cannot be reliably verified, clearly mention that it should be confirmed before booking.

Present the final answer in a clean format with:

* A quick trip overview
* Day-by-day itinerary
* Travel details between every major stop
* Accommodation recommendations
* Transport hubs and connections
* Estimated cost breakdown
* A final table summarizing the complete trip

Make the itinerary practical for a real traveler, not just a generic list of tourist attractions.
And give this whole data in JSON structure format, so that we can easily work on this, also do not write anything more than required information
Also give all prices in Indian Rupees. Also give link of internet images of the places`;
    if (process.env.USE_MOCK === "true") {
      finalAns = mockData;
      return res.render("show.ejs", { finalAns });
    }
    // Stream the response to get reasoning tokens in usage
    const completion = await openrouter.chat.send({
      chatRequest: {
        max_tokens: 6000,
        model: "openrouter/free",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "system",
            content:
              'You are a strict data-formatting API. Your only job is to generate a travel itinerary based on the user\'s constraints and return it strictly as a JSON object matching the exact schema provided below. Do not include conversational filler, greetings, or markdown code blocks outside the JSON.\n\nEXPECTED JSON SCHEMA:\n{\n  "trip_overview": "String - A short summary of the trip",\n  "itinerary": [\n    {\n      "day": "Number",\n      "title": "String - Theme of the day",\n      "schedule": [\n        {\n          "time": "String - e.g., 09:00 AM - 11:30 AM",\n          "activity": "String",\n          "description": "String - Details including hidden gems"\n        }\n      ],\n      "artisan_experience": {\n        "workshop_name": "String - Verified name or type",\n        "craft_type": "String",\n        "authenticity_details": "String",\n        "practical_info": "String"\n      },\n      "travel_between_locations": [\n        {\n          "from": "String",\n          "to": "String",\n          "distance": "String",\n          "estimated_time": "String",\n          "recommended_mode": "String",\n          "options": [\n            {\n              "mode": "String - e.g., Local Bus, Private Taxi",\n              "fare": "String"\n            }\n          ]\n        }\n      ]\n    }\n  ],\n  "accommodations": [\n    {\n      "day": "Number",\n      "name": "String",\n      "type": "String - e.g., Homestay",\n      "price_per_night": "String",\n      "location": "String",\n      "facilities": ["String"],\n      "why_choose": "String",\n      "certifications_or_reviews": "String"\n    }\n  ],\n  "transport_hubs": [\n    {\n      "hub_type": "String - Airport, Station, Bus Stand",\n      "name": "String",\n      "travel_to_main_destination": "String",\n      "estimated_fare": "String"\n    }\n  ],\n  "budget_estimate": {\n    "budget": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "mid_range": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    },\n    "comfortable": {\n      "accommodation": "String",\n      "local_transport": "String",\n      "intercity_transport": "String",\n      "entry_tickets": "String",\n      "food": "String",\n      "misc": "String",\n      "total": "String"\n    }\n  },\n  "summary_table": [\n    {\n      "day": "Number",\n      "main_destination": "String",\n      "key_activities": "String",\n      "overnight_stay": "String"\n    }\n  ],\n  "verification_notes": "String - Note which prices/times are official vs estimated"\n}',
          },
          {
            role: "user",
            content: request,
          },
        ],
        stream: false,
      },
    });
    const rawResponse = completion.choices[0]?.message?.content || "";

    // 1. Strip reasoning tags (<think>...</think>) and code blocks
    const cleanString = rawResponse
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Safely extract JSON boundaries
    const jsonMatch = cleanString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object could be extracted from model output.");
    }

    // 3. Auto-repair missing trailing brackets/quotes using jsonrepair
    const repairedJson = jsonrepair(jsonMatch[0]);
    finalAns = JSON.parse(repairedJson);
    console.log(JSON.stringify(finalAns, null, 2));
    res.render("show.ejs", { finalAns });
  } catch (err) {
    console.log("Cannot generate itienary, Please try again!");
    console.log(err);
  }
});

app.get("/showItenary/:day", (req, res) => {
  if (!finalAns) {
    return res.send("Error");
  }
  let { day } = req.params;
  const dayNum = Number(day);
  let dayItenary;
  let dayAccom;
  for (let portion of finalAns["itinerary"]) {
    if (portion["day"] === dayNum) {
      dayItenary = portion;
    }
  }

  for (let accom of finalAns["accommodations"]) {
    if (accom["day"] === dayNum) {
      dayAccom = accom;
      break;
    }
  }
  res.render("showDetails.ejs", { dayItenary, dayAccom });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
