// =========================================================
// RESULTS CONTROLLER LOGIC (result.js)
// =========================================================

const travelDatabase = {
    jaipur: {
        luxury: {
            stays: [
                { name: "Hotel Grand Sky", address: "8th Floor, Dreamax Plaza, Sahakar Marg, Jaipur 302001", rating: "4.3", reviews: "260 RATINGS" },
                { name: "Moustache Jaipur", address: "Park House 7, MI Rd, near GANPATI PLAZA, Sindhi Camp, Jaipur 302001", rating: "4.5", reviews: "4,239 RATINGS" },
                { name: "Hotel Park Central", address: "Hathroi Block, Park Central, 11, Ajmer Rd, Hathroi, Jaipur 302001", rating: "4.4", reviews: "981 RATINGS" }
            ],
            restaurants: [
                { name: "Handi Restaurant Jaipur", address: "Mirza Ismail Rd, opp. GPO, C Scheme, Ashok Nagar, Jaipur 302001", rating: "4.1", reviews: "12,858 RATINGS" },
                { name: "Peacock Restaurant", address: "51, Hathroi Fort, Hari Kishan Somani Marg, Ajmer Rd, Jaipur 302001", rating: "4.4", reviews: "3,613 RATINGS" },
                { name: "The Forresta Kitchen & Bar", address: "Devraj Niwas, Mirza Ismail Rd, Bani Park, Jaipur 302006", rating: "4.2", reviews: "5,056 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Hotel Classic Inn Jaipur", address: "Plot No 96, Kabir Marg, near Railway Station, Bani Park, Jaipur 302006", rating: "4.2", reviews: "1,705 RATINGS" },
                { name: "Hotel Om Palace", address: "Station Road, Gopal Pura, Sindhi Camp, Jaipur 302001", rating: "4.0", reviews: "840 RATINGS" }
            ],
            restaurants: [
                { name: "Rustic - Inspired Kitchen", address: "G-3, Ground Floor, UKMS, AURUM, Tilak Marg, C Scheme, Jaipur 302005", rating: "4.8", reviews: "1,362 RATINGS" },
                { name: "J Brew & Kitchen Rooftop", address: "5, Bhawani Singh Ln, C Scheme, Lalkothi, Jaipur 302001", rating: "4.6", reviews: "443 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Backpackers Hostel Jaipur", address: "Near Sindhi Camp Bus Stand, Station Road, Jaipur 302001", rating: "4.1", reviews: "520 RATINGS" }
            ],
            restaurants: [
                { name: "Tapri Central", address: "B4-E, Prithviraj Rd, C Scheme, Ashok Nagar, Jaipur 302001", rating: "4.6", reviews: "8,900 RATINGS" }
            ]
        }
    },
    mumbai: {
        luxury: {
            stays: [
                { name: "The Taj Mahal Palace", address: "Colaba, Mumbai, Maharashtra 400001", rating: "4.8", reviews: "24,500 RATINGS" },
                { name: "The Oberoi Mumbai", address: "Nariman Point, Mumbai, Maharashtra 400021", rating: "4.7", reviews: "12,100 RATINGS" }
            ],
            restaurants: [
                { name: "Leopold Cafe", address: "Saitowah Lane, Colaba Causeway, Mumbai 400001", rating: "4.3", reviews: "18,400 RATINGS" },
                { name: "Wasabi by Morimoto", address: "The Taj Mahal Palace, Colaba, Mumbai 400001", rating: "4.6", reviews: "1,200 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Hotel Sea Princess", address: "Juhu Beach, Juhu, Mumbai, Maharashtra 400049", rating: "4.1", reviews: "3,400 RATINGS" }
            ],
            restaurants: [
                { name: "Cafe Mondegar", address: "Near Regal Cinema, Colaba, Mumbai 400001", rating: "4.4", reviews: "9,600 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Abode Bombay", address: "First Floor, Lansdowne House, MB Marg, Apollo Bunder, Colaba", rating: "4.3", reviews: "980 RATINGS" }
            ],
            restaurants: [
                { name: "Aram Vada Pav", address: "Capital Cinema Building, DN Road, CST Area, Mumbai 400001", rating: "4.5", reviews: "4,500 RATINGS" }
            ]
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Attempt to pull selections from URL parameters (if passed from tracker page) or fallback to Jaipur/Moderate
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCity = urlParams.get('city') || 'jaipur';
    const selectedBudget = urlParams.get('budget') || 'moderate';

    const cityData = travelDatabase[selectedCity] || travelDatabase['jaipur'];
    const budgetData = cityData[selectedBudget] || cityData['moderate'];

    renderResultsPanel(budgetData, selectedCity, selectedBudget);
});

function renderResultsPanel(data, city, budget) {
    const subtitleEl = document.getElementById('resultsSubtitle');
    if (subtitleEl) {
        subtitleEl.textContent = `Live Results Matched to ${city.toUpperCase()} (${budget.toUpperCase()})`;
    }
    window.currentBudgetData = data;
    switchTab('stays'); // Default tab view
}

function switchTab(type) {
    const tabStays = document.getElementById('tabStays');
    const tabRestaurants = document.getElementById('tabRestaurants');
    const contentArea = document.getElementById('resultsListContent');

    if (!window.currentBudgetData) return;

    if (type === 'stays') {
        tabStays.classList.add('active');
        tabRestaurants.classList.remove('active');
        contentArea.innerHTML = generateCardsHTML(window.currentBudgetData.stays, 'stays');
    } else {
        tabRestaurants.classList.add('active');
        tabStays.classList.remove('active');
        contentArea.innerHTML = generateCardsHTML(window.currentBudgetData.restaurants, 'restaurants');
    }
}

function generateCardsHTML(items, category) {
    if (!items || items.length === 0) {
        return `<div class="empty-state" style="text-align:center; padding:20px; color:#fff;"><p>No ${category} found for this filter combination.</p></div>`;
    }

    return items.map(item => `
        <div class="result-card">
            <div class="result-header">
                <span class="result-title">${item.name}</span>
                <span class="result-rating">&#9733; ${item.rating}</span>
            </div>
            <div class="result-address">${item.address}</div>
            <div class="result-footer">
                <span>&#128508; ROUTE FROM CITY CENTRE &bull; ${item.reviews}</span>
            </div>
        </div>
    `).join('');
}