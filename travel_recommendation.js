const input = document.getElementById("search-input");
const searchResultsContainerList = document.getElementById("rc-search-results-container");
const resultCardTemplateOriginal = document.getElementById("search-result-card-template");
const resultCardTemplate = resultCardTemplateOriginal.cloneNode(true);
resultCardTemplateOriginal.remove();
const searchResultsLog = document.getElementById("rc-search-results-log");

let cardsList = [];

document.getElementById("search-btn").onclick = searchCommand;
document.getElementById("clear-btn").onclick = clearRecommendationsList;
input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchCommand();
});

async function searchCommand() {
    let inputVal = input.value;
    if (!inputVal || inputVal == "") return;

    try {
        const response = await fetch("./travel_recommendation_api.json", {method: "GET"});
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        response.json().then(result => {
            searchAPI(inputVal, result);
        }).catch( error => {throw new Error(error.message)} );
    }
    catch(error) {
        throw new Error(error.message);
    }
}

function searchAPI(inputOrigin, apiData) {
    const inputVal = inputOrigin.toLowerCase();

    const entries = Object.entries(apiData);
    let result = entries.filter(([k, v]) => k.toLowerCase() === inputVal);
    
    // search for specific place
    if (result.length === 0){
        let resultArr = [];
        const _arr = entries.filter(([k, v]) => k === "countries")[0][1]
            .filter(el => el.name.toLowerCase() === inputVal);
        if (Array.isArray(_arr) && _arr.length > 0)
            resultArr = _arr[0].cities
        
        if (resultArr.length > 0) {
            result = resultArr;
        }
    }
    // search for generic places
    else {
        result = result[0][1];
    }

    if (result.length > 0) {
        console.log(result);
        showResult(result);
        searchResultsLog.innerHTML = `Results for ${inputOrigin}`;
        input.value = "";
    } else {
        clearRecommendationsList();
        alert("No results found!");
    }
}

function showResult(resultArr) {
    if (cardsList.length > 0) clearRecommendationsList();

    resultArr.forEach(el => {
        let newCard = resultCardTemplate.cloneNode(true);
        fillLocationCard(newCard, el);
        cardsList.push(newCard);
        searchResultsContainerList.appendChild(newCard);
    });

    searchResultsContainerList.classList.remove("hidden");
}

function fillLocationCard(card, data) {
    let img = card.querySelector(".sr-img");
    let name = card.querySelector(".sr-name");
    let description = card.querySelector(".sr-description");
    let goBtn = card.querySelector(".sr-visit-btn");

    img.src = data.imageUrl;
    name.innerHTML = data.name;
    description.innerHTML = data.description;
}

function clearRecommendationsList() {
    cardsList.forEach(el => el.remove())
    cardsList = [];
    if (!searchResultsContainerList.classList.contains("hidden"))
        searchResultsContainerList.classList.add("hidden");
    searchResultsLog.innerHTML = "";
    input.value = "";
}