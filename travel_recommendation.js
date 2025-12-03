const input = document.getElementById("search-input");
const searchResultsContainerList = document.getElementById("rc-search-results-container");
const resultCardTemplateOriginal = document.getElementById("search-result-card-template");
const resultCardTemplate = resultCardTemplateOriginal.cloneNode(true);
resultCardTemplateOriginal.remove();
const searchResultsLog = document.getElementById("rc-search-results-log");

let cardsList = [];
const MAX_DISTANCE = 2;

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

function searchAPI(inputVal, apiData) {
    const inputNormalized = inputVal.toLowerCase();
    const places = apiData.places;

    let results = places.filter(place => {
        return place.tags.filter(tag => levenshteinDistance(tag.toLowerCase(), inputNormalized) <= MAX_DISTANCE).length > 0;
    });

    if (results.length > 0) {
        console.log(results);
        showResult(results);
        searchResultsLog.innerHTML = `Results for ${inputVal}`;
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

//CREDITS: https://stackoverflow.com/questions/18516942/fastest-general-purpose-levenshtein-javascript-implementation
function levenshteinDistance(s1, s2) {
    if (s1 === s2)
        return 0;

    var s1_len = s1.length, s2_len = s2.length;
    if (s1_len && s2_len) {
        var i1 = 0, i2 = 0, a, b, c, c2, row = [];
        while (i1 < s1_len)
            row[i1] = ++i1;
        while (i2 < s2_len) {
            c2 = s2.charCodeAt(i2);
            a = i2;
            ++i2;
            b = i2;
            for (i1 = 0; i1 < s1_len; ++i1) {
                c = a + (s1.charCodeAt(i1) === c2 ? 0 : 1);
                a = row[i1];
                b = b < a ? (b < c ? b + 1 : c) : (a < c ? a + 1 : c);
                row[i1] = b;
            }
        }
        return b;
    }
    return s1_len + s2_len;
}