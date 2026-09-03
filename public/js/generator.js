
    // DAYS SLIDER

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const slider =
    document.getElementById("daysSlider");

const daysValue =
    document.getElementById("daysValue");

const dateInput = document.getElementById('startDate');

slider.addEventListener("input", () => {

    daysValue.textContent = slider.value;

});


    // passenger SLIDER


const passengersSlider =
    document.getElementById("passengersSlider");

const passengersValue =
    document.getElementById("passengersValue");


passengersSlider.addEventListener("input", () => {

    passengersValue.textContent = passengersSlider.value;

});



    // BUDGET BUTTONS


const budgetButtons =
    document.querySelectorAll(".budget-btn");


budgetButtons.forEach(button => {

    button.addEventListener("click", () => {

        budgetButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

    });

});




    // VIBE BUTTONS


const vibeButtons =
    document.querySelectorAll(".vibe-btn");


vibeButtons.forEach(button => {

    button.addEventListener("click", () => {

        vibeButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

    });

});




    // GENERATE BUTTON


const generateButton =
    document.getElementById("generateBtn");

generateButton.addEventListener("click", () => {
    
    let budget_btn;
    for(let btn of budgetButtons){
        if(btn.classList.contains("active")){
            budget_btn = btn;
            break;
        }
    }
    const budget = budget_btn.innerText;

    const destination =
    document.getElementById("destination").value;
    const language =
    document.getElementById("language").value;
    const noOfTravelers = passengersSlider.value;
    const days =
        slider.value;
    const dateObj = dateInput.valueAsDate;
    if(dateObj){
        const month = months[dateObj.getMonth()];
        window.location.href = `../showItinerary?place=${destination}&month=${month}&days=${days}&noOfTravelers=${noOfTravelers}&budget=${budget}&language=${language}`
    }else{
        alert("please select a valid date");
    }
});



    // VIEW RESTAURANTS & COMFORT STAYS BUTTON


const viewStaysRestaurantsBtn = document.getElementById("viewStaysRestaurantsBtn");

viewStaysRestaurantsBtn.addEventListener("click", () => {
    const destinationSelect = document.getElementById("destination");
    const selectedCity = destinationSelect ? destinationSelect.value.trim().toLowerCase() : "jaipur";

    const activeBudgetBtn = document.querySelector(".budget-btn.active");
    let selectedBudget = activeBudgetBtn ? activeBudgetBtn.textContent.trim().toLowerCase() : "comfort";

    if (selectedBudget === "shoestring") {
        selectedBudget = "budget";
    } else if (selectedBudget === "comfort") {
        selectedBudget = "moderate";
    } else if (selectedBudget === "luxury") {
        selectedBudget = "luxury";
    }

    window.location.href = `../showResults?city=${selectedCity}&budget=${selectedBudget}`;
});
