module.exports = (conditions, language) => {
return `I am planning a small tour of **${conditions}**. Create a detailed, practical, and well-structured **day-by-day travel itinerary** for me.

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
Also give all prices in Indian Rupees.
CRITICAL INSTRUCTION: Generate the actual content, descriptions, and details in ${language}. However, the JSON keys MUST remain exactly as requested in English.`
}