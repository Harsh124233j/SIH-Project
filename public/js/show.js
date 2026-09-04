import { jsonrepair } from 'https://cdn.jsdelivr.net/npm/jsonrepair@3.8.0/+esm';

const queryParams = new URLSearchParams(window.location.search);

async function startStream() {
    try {
        const response = await fetch(`/api/streamItinerary?${queryParams.toString()}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedRawText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const events = chunk.split("\n\n");

            for (const event of events) {
                if (event.startsWith("data: ")) {
                    const dataString = event.replace("data: ", "");
                    if (dataString == '[DONE]') {
                        document.getElementById("loading-spinner").innerText = "Completed!";
                        alert("Your Day by Day Itinerary is Generated!!!")
                        return;
                    }
                    try {
                        const payLoad = JSON.parse(dataString);
                        if (payLoad.type === 'chunk') {
                            accumulatedRawText += payLoad.text;
                        } else if (payLoad.type === 'full') {
                            accumulatedRawText = JSON.stringify(payLoad.data);
                        }

                        const cleanText = accumulatedRawText
                            .replace(/<think>[\s\S]*?<\/think>/gi, "")
                            .replace(/<think>[\s\S]*/gi, "") // incomplete think tag while streaming
                            .replace(/```json/gi, "")
                            .replace(/```/g, "")
                            .trim();

                        if (cleanText) {
                            const validJsonString = jsonrepair(accumulatedRawText.trim());
                            const dataObj = JSON.parse(validJsonString);

                            updateUI(dataObj);
                        }

                    } catch (e) {
                        console.error("Stream falied", e);
                    }
                }

            }
        }
    } catch (err) {

    }
}

function updateUI(data) {
    if (data.trip_overview) {
        document.getElementById("trip-overview").innerText = data.trip_overview;
    }

    if (data.summary_table) {
        const summaryHTML = data.summary_table.map((part) => {
            return `
                <form method="GET" class="day-card" action="/showItinerary/${part["day"]}">
                    <div class="day-wrapper">
                        <div class="day-block">
                            <span class="day-number">${part["day"]}</span>
                        </div>
                    </div>
                    
                    <div class="content-wrapper">
                        <div class="main-dest-block">
                            <p class="destination"><span>Main Destination:</span> ${part["main_destination"]}</p>
                        </div>
                        
                        <div class="details-block">
                            <p class="item activities">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                    <polyline points="2 12 12 17 22 12"></polyline>
                                    <polyline points="2 17 12 22 22 17"></polyline>
                                </svg>
                                <span>Activities:</span> ${part["key_activities"]} 
                            </p>
                            <p class="item overnight">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                <span>Overnight Stay:</span> ${part["overnight_stay"]} 
                            </p>
                        </div>
                    </div>
                    
                    <div class="action-block">
                        <button type="submit" class="view-btn">View in details</button>
                    </div>
                </form>
            `
        }).join("");
        document.getElementById("summary_container").innerHTML = summaryHTML;
    }


    if (data.transport_hubs) {
        const transportHTML = data.transport_hubs.map((opt) => {
            return `
                <div class="fee">
                    <h4> Type :  ${opt["hub_type"]}</h4>

                    <p class="item"><span>Name :</span>
                        ${opt["name"]}
                        </p>
                    <p class="item"><span>Estimated fare : </span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        ${opt["estimated_fare"]}</p>
                </div>
            `;
        }).join("");
        document.getElementById("transport_container").innerHTML = transportHTML;
    }

    // Budget
    if (data["budget_estimate"]["budget"]["accommodation"]) {
        document.getElementById("budget_accom").innerText = data["budget_estimate"]["budget"]["accommodation"];
    }
    if (data["budget_estimate"]["budget"]["local_transport"]) {
        document.getElementById("budget_lt").innerText = data["budget_estimate"]["budget"]["local_transport"];
    }
    if (data["budget_estimate"]["budget"]["intercity_transport"]) {
        document.getElementById("budget_it").innerText = data["budget_estimate"]["budget"]["intercity_transport"];
    }
    if (data["budget_estimate"]["budget"]["entry_tickets"]) {
        document.getElementById("budget_et").innerText = data["budget_estimate"]["budget"]["entry_tickets"];
    }
    if (data["budget_estimate"]["budget"]["food"]) {
        document.getElementById("budget_food").innerText = data["budget_estimate"]["budget"]["food"];
    }
    if (data["budget_estimate"]["budget"]["misc"]) {
        document.getElementById("budget_misc").innerText = data["budget_estimate"]["budget"]["misc"];
    }
    if (data["budget_estimate"]["budget"]["total"]) {
        document.getElementById("budget_total").innerText = data["budget_estimate"]["budget"]["total"];
    }


    // Mid-range
    if (data["budget_estimate"]["mid_range"]["accommodation"]) {
        document.getElementById("mid_r_accom").innerText = data["budget_estimate"]["mid_range"]["accommodation"];
    }
    if (data["budget_estimate"]["mid_range"]["local_transport"]) {
        document.getElementById("mid_r_lt").innerText = data["budget_estimate"]["mid_range"]["local_transport"];
    }
    if (data["budget_estimate"]["mid_range"]["intercity_transport"]) {
        document.getElementById("mid_r_it").innerText = data["budget_estimate"]["mid_range"]["intercity_transport"];
    }
    if (data["budget_estimate"]["mid_range"]["entry_tickets"]) {
        document.getElementById("mid_r_et").innerText = data["budget_estimate"]["mid_range"]["entry_tickets"];
    }
    if (data["budget_estimate"]["mid_range"]["food"]) {
        document.getElementById("mid_r_food").innerText = data["budget_estimate"]["mid_range"]["food"];
    }
    if (data["budget_estimate"]["mid_range"]["misc"]) {
        document.getElementById("mid_r_misc").innerText = data["budget_estimate"]["mid_range"]["misc"];
    }
    if (data["budget_estimate"]["mid_range"]["total"]) {
        document.getElementById("mid_r_total").innerText = data["budget_estimate"]["mid_range"]["total"];
    }

    // comfortable
    if (data["budget_estimate"]["comfortable"]["accommodation"]) {
        document.getElementById("comf_accom").innerText = data["budget_estimate"]["comfortable"]["accommodation"];
    }
    if (data["budget_estimate"]["comfortable"]["local_transport"]) {
        document.getElementById("comf_lt").innerText = data["budget_estimate"]["comfortable"]["local_transport"];
    }
    if (data["budget_estimate"]["comfortable"]["intercity_transport"]) {
        document.getElementById("comf_it").innerText = data["budget_estimate"]["comfortable"]["intercity_transport"];
    }
    if (data["budget_estimate"]["comfortable"]["entry_tickets"]) {
        document.getElementById("comf_et").innerText = data["budget_estimate"]["comfortable"]["entry_tickets"];
    }
    if (data["budget_estimate"]["comfortable"]["food"]) {
        document.getElementById("comf_food").innerText = data["budget_estimate"]["comfortable"]["food"];
    }
    if (data["budget_estimate"]["comfortable"]["misc"]) {
        document.getElementById("comf_misc").innerText = data["budget_estimate"]["comfortable"]["misc"];
    }
    if (data["budget_estimate"]["comfortable"]["total"]) {
        document.getElementById("comf_total").innerText = data["budget_estimate"]["comfortable"]["total"];
    }

    if (data.verification_notes) {
        document.getElementById("verf_notes").innerText = data.verification_notes;
    }
}
if (typeof window.savedItinerary !== 'undefined') {
    document.getElementById("loading-spinner").innerText = "Completed!";
    updateUI(window.savedItinerary); // Direct object pass kiya hai
} else {
    startStream();
}



