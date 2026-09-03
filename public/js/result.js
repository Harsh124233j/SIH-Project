// =========================================================
// RESULTS CONTROLLER LOGIC (result.js) - EXPANDED (MIN 4 OPTIONS)
// =========================================================

const travelDatabase = {
    jaipur: {
        luxury: {
            stays: [
                { name: "Rambagh Palace", address: "Bhawani Singh Rd, Rambagh, Jaipur", rating: "4.9", reviews: "5,400 RATINGS" },
                { name: "Fairmont Jaipur", address: "Riico Kukas, Jaipur, Rajasthan", rating: "4.7", reviews: "4,100 RATINGS" },
                { name: "The Oberoi Rajvilas", address: "Goner Rd, Saket Colony, Jaipur", rating: "4.8", reviews: "3,900 RATINGS" },
                { name: "Taj Jai Mahal Palace", address: "Jacob Rd, Civil Lines, Jaipur", rating: "4.6", reviews: "4,800 RATINGS" }
            ],
            restaurants: [
                { name: "Suvarna Mahal", address: "Rambagh Palace, Bhawani Singh Rd, Jaipur", rating: "4.8", reviews: "1,850 RATINGS" },
                { name: "Peacock Rooftop Restaurant", address: "51, Hathroi Fort, Ajmer Rd, Jaipur", rating: "4.4", reviews: "3,613 RATINGS" },
                { name: "Baradari Restaurant", address: "City Palace, Jaleb Chowk, Jaipur", rating: "4.5", reviews: "2,100 RATINGS" },
                { name: "Steam Lounge", address: "Rambagh Palace, Jaipur", rating: "4.6", reviews: "940 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Umaid Bhawan Heritage House", address: "D1-2A, Behind Collectorate, Bani Park", rating: "4.5", reviews: "3,200 RATINGS" },
                { name: "Alsisar Haveli", address: "Sansar Chandra Road, Jaipur", rating: "4.4", reviews: "2,850 RATINGS" },
                { name: "Hotel Classic Inn Jaipur", address: "Plot No 96, Kabir Marg, Bani Park", rating: "4.2", reviews: "1,705 RATINGS" },
                { name: "Hotel Om Palace", address: "Station Road, Gopal Pura, Sindhi Camp", rating: "4.0", reviews: "840 RATINGS" }
            ],
            restaurants: [
                { name: "Spice Court", address: "Jacob Road, Civil Lines, Jaipur", rating: "4.4", reviews: "4,500 RATINGS" },
                { name: "Chokhi Dhani Village Resort", address: "12 Miles Tonk Road, Jaipur", rating: "4.5", reviews: "15,200 RATINGS" },
                { name: "Rustic - Inspired Kitchen", address: "G-3, Ground Floor, UKMS, Tilak Marg", rating: "4.8", reviews: "1,362 RATINGS" },
                { name: "J Brew & Kitchen Rooftop", address: "5, Bhawani Singh Ln, Lalkothi", rating: "4.6", reviews: "443 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Zostel Jaipur", address: "First Floor, Hawa Mahal Road, Badi Choupad", rating: "4.6", reviews: "2,100 RATINGS" },
                { name: "The Hosteller Jaipur", address: "M.I. Road, Near Sindhi Camp", rating: "4.5", reviews: "1,800 RATINGS" },
                { name: "Moustache Jaipur", address: "Park House 7, MI Rd, near GANPATI PLAZA", rating: "4.5", reviews: "4,239 RATINGS" },
                { name: "Backpackers Hostel Jaipur", address: "Near Sindhi Camp Bus Stand, Station Road", rating: "4.1", reviews: "520 RATINGS" }
            ],
            restaurants: [
                { name: "Rawat Mishtan Bhandar", address: "Station Road, Sindhi Camp, Jaipur", rating: "4.4", reviews: "22,500 RATINGS" },
                { name: "Laxmi Mishthan Bhandar (LMB)", address: "Johari Bazar, Jaipur", rating: "4.0", reviews: "18,900 RATINGS" },
                { name: "Tapri Central", address: "B4-E, Prithviraj Rd, C Scheme", rating: "4.6", reviews: "8,900 RATINGS" },
                { name: "Gopal Ji Ka Petha", address: "Choura Rasta, Jaipur", rating: "4.3", reviews: "1,150 RATINGS" }
            ]
        }
    },
    mumbai: {
        luxury: {
            stays: [
                { name: "The Taj Mahal Palace", address: "Colaba, Mumbai", rating: "4.8", reviews: "24,500 RATINGS" },
                { name: "The St. Regis Mumbai", address: "Lower Parel, Mumbai", rating: "4.7", reviews: "6,800 RATINGS" },
                { name: "The Oberoi Mumbai", address: "Nariman Point, Mumbai", rating: "4.7", reviews: "12,100 RATINGS" },
                { name: "Trifecta Trident Nariman Point", address: "Nariman Point, Mumbai", rating: "4.6", reviews: "5,100 RATINGS" }
            ],
            restaurants: [
                { name: "Wasabi by Morimoto", address: "The Taj Mahal Palace, Colaba", rating: "4.6", reviews: "1,200 RATINGS" },
                { name: "Bastian - Bandra", address: "Linking Rd, Bandra West, Mumbai", rating: "4.4", reviews: "5,200 RATINGS" },
                { name: "The Table", address: "Falkland Estate, Colaba, Mumbai", rating: "4.5", reviews: "4,100 RATINGS" },
                { name: "Yauatcha Mumbai", address: "Bandra Kurla Complex, Mumbai", rating: "4.5", reviews: "3,800 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Gordon House Hotel", address: "5 Battery Street, Apollo Bunder, Colaba", rating: "4.3", reviews: "1,200 RATINGS" },
                { name: "West End Hotel", address: "45 New Marine Lines, Mumbai", rating: "4.1", reviews: "1,800 RATINGS" },
                { name: "Hotel Sea Princess", address: "Juhu Beach, Juhu, Mumbai", rating: "4.1", reviews: "3,400 RATINGS" },
                { name: "Fariyas Hotel Mumbai", address: "Off Arthur Bunder Road, Colaba", rating: "4.2", reviews: "2,150 RATINGS" }
            ],
            restaurants: [
                { name: "Britannia & Co. Restaurant", address: "Wakefield House, Ballard Estate", rating: "4.5", reviews: "8,100 RATINGS" },
                { name: "Mahesh Lunch Home", address: "Cawasji Patel Street, Fort, Mumbai", rating: "4.4", reviews: "9,200 RATINGS" },
                { name: "Cafe Mondegar", address: "Near Regal Cinema, Colaba, Mumbai", rating: "4.4", reviews: "9,600 RATINGS" },
                { name: "Gajalee", address: "Hanuman Rd, Vile Parle East, Mumbai", rating: "4.5", reviews: "7,300 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Zostel Mumbai", address: "Marol, Andheri East, Mumbai", rating: "4.5", reviews: "1,950 RATINGS" },
                { name: "Hornbill Hostel", address: "Off Carter Road, Bandra West, Mumbai", rating: "4.6", reviews: "850 RATINGS" },
                { name: "YMCA International House", address: "18 YMCA Road, Mumbai Central", rating: "4.2", reviews: "1,100 RATINGS" },
                { name: "Abode Bombay", address: "Lansdowne House, Apollo Bunder, Colaba", rating: "4.3", reviews: "980 RATINGS" }
            ],
            restaurants: [
                { name: "Kyani & Co.", address: "JSS Road, Marine Lines, Mumbai", rating: "4.3", reviews: "12,300 RATINGS" },
                { name: "Bademiya", address: "Tulloch Road, Apollo Bunder, Colaba", rating: "4.1", reviews: "25,400 RATINGS" },
                { name: "Ashok Vada Pav", address: "Kirti College Lane, Prabhadevi", rating: "4.6", reviews: "6,700 RATINGS" },
                { name: "Aram Vada Pav", address: "DN Road, CST Area, Mumbai", rating: "4.5", reviews: "4,500 RATINGS" }
            ]
        }
    },
    delhi: {
        luxury: {
            stays: [
                { name: "The Leela Palace", address: "Diplomatic Enclave, Chanakyapuri", rating: "4.8", reviews: "9,100 RATINGS" },
                { name: "The Imperial New Delhi", address: "Janpath, Connaught Place, New Delhi", rating: "4.7", reviews: "7,300 RATINGS" },
                { name: "Taj Palace New Delhi", address: "Diplomatic Enclave, New Delhi", rating: "4.7", reviews: "8,500 RATINGS" },
                { name: "The Oberoi New Delhi", address: "Dr Zakir Hussain Marg, New Delhi", rating: "4.8", reviews: "6,400 RATINGS" }
            ],
            restaurants: [
                { name: "Indian Accent", address: "The Lodhi, CGO Complex, New Delhi", rating: "4.7", reviews: "5,400 RATINGS" },
                { name: "Bukhara", address: "ITC Maurya, Diplomatic Enclave, New Delhi", rating: "4.8", reviews: "8,200 RATINGS" },
                { name: "Dum Pukht", address: "ITC Maurya, New Delhi", rating: "4.7", reviews: "4,100 RATINGS" },
                { name: "Le Cirque", address: "The Leela Palace, Chanakyapuri", rating: "4.6", reviews: "1,800 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Bloomrooms @ New Delhi Railway Station", address: "Arakashan Road, New Delhi", rating: "4.4", reviews: "3,500 RATINGS" },
                { name: "Hotel Palace Heights", address: "Connaught Place, New Delhi", rating: "4.3", reviews: "1,800 RATINGS" },
                { name: "Hotel City Star", address: "Pahar Ganj, New Delhi", rating: "4.0", reviews: "1,200 RATINGS" },
                { name: "The Hans Hotel", address: "Barakhamba Road, Connaught Place", rating: "4.2", reviews: "2,400 RATINGS" }
            ],
            restaurants: [
                { name: "Rajinder Da Dhaba", address: "Safdarjung Enclave Market, New Delhi", rating: "4.4", reviews: "18,200 RATINGS" },
                { name: "Cafe Lota", address: "National Crafts Museum, Pragati Maidan", rating: "4.6", reviews: "4,900 RATINGS" },
                { name: "Karim's", address: "Jama Masjid, Gali Kababian, Old Delhi", rating: "4.5", reviews: "14,000 RATINGS" },
                { name: "United Coffee House", address: "Connaught Place, New Delhi", rating: "4.3", reviews: "9,800 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "goStops Delhi", address: "Asaf Ali Road, Daryaganj, New Delhi", rating: "4.4", reviews: "2,200 RATINGS" },
                { name: "Madpackers Hostel", address: "Panchsheel Park, New Delhi", rating: "4.6", reviews: "1,400 RATINGS" },
                { name: "Zostel Delhi", address: "Aram Nagar, Pahar Ganj, New Delhi", rating: "4.3", reviews: "890 RATINGS" },
                { name: "The CrashPad Hostel", address: "Greater Kailash, New Delhi", rating: "4.1", reviews: "540 RATINGS" }
            ],
            restaurants: [
                { name: "Sita Ram Diwan Chand", address: "Chuna Mandi, Paharganj, New Delhi", rating: "4.5", reviews: "16,000 RATINGS" },
                { name: "Kake Da Hotel", address: "Connaught Place, New Delhi", rating: "4.2", reviews: "13,500 RATINGS" },
                { name: "Saravana Bhavan", address: "Janpath, Connaught Place, New Delhi", rating: "4.4", reviews: "11,000 RATINGS" },
                { name: "Shri Balaji Chaat Bhandar", address: "Chandni Chowk, Old Delhi", rating: "4.3", reviews: "4,200 RATINGS" }
            ]
        }
    },
    agra: {
        luxury: {
            stays: [
                { name: "The Oberoi Amarvilas", address: "Taj East Gate Rd, Agra", rating: "4.9", reviews: "6,200 RATINGS" },
                { name: "ITC Mughal, A Luxury Collection Hotel", address: "Fatehabad Road, Agra", rating: "4.6", reviews: "5,100 RATINGS" },
                { name: "Jaypee Palace Hotel", address: "Fatehabad Road, Agra", rating: "4.4", reviews: "4,800 RATINGS" },
                { name: "Taj Hotel & Convention Centre", address: "Fatehabad Road, Agra", rating: "4.5", reviews: "3,700 RATINGS" }
            ],
            restaurants: [
                { name: "Pinch of Spice", address: "Fatehabad Road, Agra", rating: "4.4", reviews: "4,100 RATINGS" },
                { name: "Esphahan", address: "The Oberoi Amarvilas, Agra", rating: "4.8", reviews: "1,400 RATINGS" },
                { name: "Bindra's", address: "Fatehabad Road, Agra", rating: "4.2", reviews: "1,900 RATINGS" },
                { name: "Taj Bano", address: "ITC Mughal, Agra", rating: "4.5", reviews: "890 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Atulyaa Taj", address: "Taj East Gate Road, Shilpgram, Agra", rating: "4.1", reviews: "2,100 RATINGS" },
                { name: "Taj Vilas", address: "Fatehabad Road, Tajganj, Agra", rating: "4.0", reviews: "1,300 RATINGS" },
                { name: "Hotel Taj Resorts", address: "Near Taj Mahal, Shilpgram, Agra", rating: "4.2", reviews: "1,500 RATINGS" },
                { name: "Hotel Royale Residency", address: "Taj East Gate Road, Agra", rating: "4.1", reviews: "980 RATINGS" }
            ],
            restaurants: [
                { name: "Dasaprakash", address: "Meher Cinema Complex, Agra", rating: "4.2", reviews: "2,400 RATINGS" },
                { name: "Mama Chicken Mama Franky", address: "Sadar Bazaar, Agra", rating: "4.3", reviews: "8,900 RATINGS" },
                { name: "Joney's Place", address: "South Gate Taj Mahal, Agra", rating: "4.3", reviews: "950 RATINGS" },
                { name: "Peshawri", address: "ITC Mughal, Agra", rating: "4.6", reviews: "3,200 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Zostel Agra", address: "Taj Nagari Phase 1, Agra", rating: "4.5", reviews: "2,600 RATINGS" },
                { name: "Moustache Agra", address: "Tajganj, Near Taj Mahal, Agra", rating: "4.4", reviews: "1,100 RATINGS" },
                { name: "Backpackers Bed & Breakfast", address: "Taj East Gate Road, Agra", rating: "4.1", reviews: "430 RATINGS" },
                { name: "Coral House Homestay", address: "Taj East Gate Road, Agra", rating: "4.3", reviews: "610 RATINGS" }
            ],
            restaurants: [
                { name: "Shankara Vegis Restaurant", address: "Taj Ganj, Agra", rating: "4.4", reviews: "1,200 RATINGS" },
                { name: "Deviram Sweets", address: "Pratap Pura, Agra", rating: "4.3", reviews: "5,600 RATINGS" },
                { name: "Bhagat Halwai", address: "Sanjay Place, Agra", rating: "4.2", reviews: "2,200 RATINGS" },
                { name: "Gmb (Gopika Sweets)", address: "Fatehabad Road, Agra", rating: "4.1", reviews: "1,800 RATINGS" }
            ]
        }
    },
    goa: {
        luxury: {
            stays: [
                { name: "W Goa", address: "Vagator Beach, Bardez, Goa", rating: "4.6", reviews: "4,100 RATINGS" },
                { name: "Taj Exotica Resort & Spa", address: "Benaulim, South Goa", rating: "4.8", reviews: "5,300 RATINGS" },
                { name: "The Leela Goa", address: "Mobor, Cavelossim, Goa", rating: "4.7", reviews: "4,600 RATINGS" },
                { name: "Grand Hyatt Goa", address: "Bambolim, North Goa", rating: "4.6", reviews: "6,100 RATINGS" }
            ],
            restaurants: [
                { name: "Thalassa", address: "Vagator, Siolim, Goa", rating: "4.4", reviews: "11,200 RATINGS" },
                { name: "A Reverie", address: "Baga Calangute Road, Bardez, Goa", rating: "4.6", reviews: "2,400 RATINGS" },
                { name: "Black Sheep Bistro", address: "Panaji, Goa", rating: "4.5", reviews: "3,200 RATINGS" },
                { name: "Morisco", address: "Taj Exotica, Benaulim, Goa", rating: "4.7", reviews: "1,100 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Santana Beach Resort", address: "Candolim Beach, Goa", rating: "4.4", reviews: "3,200 RATINGS" },
                { name: "Art Resort Goa", address: "Palolem Beach, Canacona", rating: "4.6", reviews: "1,500 RATINGS" },
                { name: "Casa Severina", address: "Calangute, Goa", rating: "4.7", reviews: "950 RATINGS" },
                { name: "Lemon Tree Amarante Beach Resort", address: "Candolim, Goa", rating: "4.3", reviews: "2,900 RATINGS" }
            ],
            restaurants: [
                { name: "Gunpowder", address: "Assagao, Bardez, Goa", rating: "4.5", reviews: "4,800 RATINGS" },
                { name: "Vinayak Family Restaurant", address: "Assagao, Bardez, Goa", rating: "4.6", reviews: "3,100 RATINGS" },
                { name: "Britto's", address: "Baga Beach, Goa", rating: "4.2", reviews: "21,000 RATINGS" },
                { name: "Curlies Beach Shack", address: "Anjuna Beach, Goa", rating: "4.1", reviews: "6,300 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Zostel Goa", address: "Calangute, Goa", rating: "4.4", reviews: "2,400 RATINGS" },
                { name: "Pappi Chulo", address: "Vagator, Goa", rating: "4.5", reviews: "1,800 RATINGS" },
                { name: "Woke Hostel", address: "Arpora, Goa", rating: "4.6", reviews: "920 RATINGS" },
                { name: "Anjuna Backpacker Hostel", address: "Anjuna, Goa", rating: "4.2", reviews: "890 RATINGS" }
            ],
            restaurants: [
                { name: "Anand Seafood Restaurant", address: "Anjuna, Goa", rating: "4.4", reviews: "4,200 RATINGS" },
                { name: "Infantaria", address: "Baga-Calangute Road, Goa", rating: "4.1", reviews: "8,900 RATINGS" },
                { name: "Café Bhonsle", address: "Panaji, Goa", rating: "4.3", reviews: "2,100 RATINGS" },
                { name: "Joseph Bar", address: "Fontainhas, Panaji, Goa", rating: "4.5", reviews: "1,600 RATINGS" }
            ]
        }
    },
    varanasi: {
        luxury: {
            stays: [
                { name: "BrijRama Palace", address: "Darbhanga Ghat, Varanasi", rating: "4.8", reviews: "2,400 RATINGS" },
                { name: "Taj Ganges Varanasi", address: "Nadesar Palace Grounds, Varanasi", rating: "4.7", reviews: "3,800 RATINGS" },
                { name: "Brij Gajraj Palace", address: "Near Kashi Vishwanath Temple, Varanasi", rating: "4.6", reviews: "1,100 RATINGS" },
                { name: "Radisson Hotel Varanasi", address: "Cantonment, Varanasi", rating: "4.5", reviews: "4,200 RATINGS" }
            ],
            restaurants: [
                { name: "Pizzeria Vaatika Cafe", address: "Assi Ghat, Varanasi", rating: "4.4", reviews: "3,100 RATINGS" },
                { name: "Darbaar Restaurant", address: "BrijRama Palace, Darbhanga Ghat", rating: "4.7", reviews: "950 RATINGS" },
                { name: "The Great Kabab Factory", address: "Radisson Hotel, Cantonment", rating: "4.3", reviews: "1,500 RATINGS" },
                { name: "Varanasi Kitchen", address: "Godowlia, Varanasi", rating: "4.2", reviews: "1,100 RATINGS" }
            ]
        },
        moderate: {
            stays: [
                { name: "Amritara Suryauday Haveli", address: "Shivala Ghat, Varanasi", rating: "4.5", reviews: "980 RATINGS" },
                { name: "Palace on Ganges", address: "Assi Ghat, Varanasi", rating: "4.2", reviews: "1,400 RATINGS" },
                { name: "Hotel Surya", address: "Cantonment, Varanasi", rating: "4.1", reviews: "1,100 RATINGS" },
                { name: "Hindustan International", address: "Cantonment, Varanasi", rating: "4.0", reviews: "1,800 RATINGS" }
            ],
            restaurants: [
                { name: "Baati Chokha Restaurant", address: "Anand Mandir Cinema, Teliyabag", rating: "4.4", reviews: "8,200 RATINGS" },
                { name: "Canton Royale", address: "Hotel Surya, Cantonment", rating: "4.3", reviews: "1,200 RATINGS" },
                { name: "Keshari Restaurant", address: "Godowlia, Varanasi", rating: "4.0", reviews: "850 RATINGS" },
                { name: "Mona Lisa Cafe", address: "Assi Ghat, Varanasi", rating: "4.3", reviews: "1,600 RATINGS" }
            ]
        },
        budget: {
            stays: [
                { name: "Zostel Varanasi", address: "Dashashwamedh Ghat, Varanasi", rating: "4.6", reviews: "3,100 RATINGS" },
                { name: "goStops Varanasi", address: "Bhelupur, Varanasi", rating: "4.4", reviews: "1,600 RATINGS" },
                { name: "Moustache Varanasi", address: "Bangali Tola, Varanasi", rating: "4.5", reviews: "760 RATINGS" },
                { name: "International Travellers' Hostel", address: "Durgakund, Varanasi", rating: "4.3", reviews: "890 RATINGS" }
            ],
            restaurants: [
                { name: "Deena Chaat Bhandar", address: "Dashashwamedh Road, Varanasi", rating: "4.5", reviews: "5,400 RATINGS" },
                { name: "Kashi Chat Bhandar", address: "Godowlia, Varanasi", rating: "4.6", reviews: "7,800 RATINGS" },
                { name: "Ram Bhandar", address: "Thatheri Bazar, Varanasi", rating: "4.4", reviews: "2,900 RATINGS" },
                { name: "Blue Lassi", address: "Kachori Gali, Chowk, Varanasi", rating: "4.6", reviews: "4,500 RATINGS" }
            ]
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCity = urlParams.get('city') || 'jaipur';
    const selectedBudget = urlParams.get('budget') || 'moderate';

    // Link the Booking button to the dedicated booking portal with current city and budget
    const btnBooking = document.getElementById('btnGoBooking');
    if (btnBooking) {
        btnBooking.href = `/booking?city=${encodeURIComponent(selectedCity)}&budget=${encodeURIComponent(selectedBudget)}`;
    }

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
    switchTab('stays');
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
        return `<div class="empty-state" style="text-align:center; padding:20px; color:#2c1810;"><p>No ${category} found for this filter combination.</p></div>`;
    }

    return items.map(item => {
        const isStay = (category === 'stays');
        const bookingUrl = isStay
            ? `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(item.name + ' ' + item.address)}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}`;

        const actionText = isStay ? "🏨 Book on Booking.com &nearr;" : "📍 View Location &nearr;";
        const actionClass = isStay ? "result-book-btn stay-book" : "result-book-btn map-link";

        return `
            <div class="result-card">
                <div class="result-header">
                    <span class="result-title">${item.name}</span>
                    <span class="result-rating">&#9733; ${item.rating}</span>
                </div>
                <div class="result-address">${item.address}</div>
                <div class="result-actions-row" style="margin-top: 10px; margin-bottom: 8px;">
                    <a href="${bookingUrl}" target="_blank" rel="noopener noreferrer" class="${actionClass}" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; font-size: 0.8rem; font-weight: 600; text-decoration: none; border-radius: 8px; background: #003580; color: #ffffff; transition: 0.2s ease;">
                        ${actionText}
                    </a>
                </div>
                <div class="result-footer">
                    <span>&#128508; ROUTE FROM CITY CENTRE &bull; ${item.reviews}</span>
                </div>
            </div>
        `;
    }).join('');
}