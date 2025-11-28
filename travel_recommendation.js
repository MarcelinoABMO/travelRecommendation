const input = document.getElementById("search-input");
document.getElementById("search-btn").onclick = searchCommand;
const searchResultsContainerList = document.getElementById("rc-search-results-container");
const resultCardTemplateOriginal = document.getElementById("search-result-card-template");
const resultCardTemplate = resultCardTemplateOriginal.cloneNode(true);
resultCardTemplateOriginal.remove();
let cardsList = [];

async function searchCommand() {
    let inputVal = input.value;
    if (!inputVal || inputVal == "") return;

    try {
        const response = await fetch("./travel_recommendation_api.json", {method: "GET"});
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        let resultVal;
        response.json().then(result => {
            resultVal = searchAPI(inputVal, result);
        }).catch( error => {throw new Error(error.message)} );
    }
    catch(error) {
        throw new Error(error.message);
    }
}

function searchAPI(inputVal, api) {
    //console.log("input: " + inputVal);
    //console.log(api);

    inputVal = inputVal.toLowerCase();

    const entries = Object.entries(api);
    //console.log("Entries: ");
    //console.log(entries);
    let result = entries.filter(([k, v]) => k.toLowerCase() === inputVal);
    if (/*!result || */result.length === 0){ // search for specific place
        let resultArr = [];
        resultArr = entries.filter(([k, v]) => k === "countries")[0][1]
            .filter(el => el.name.toLowerCase() === inputVal)[0].cities;
        //console.log(resultArr);
        if (resultArr.length > 0) {
            //TODO: UI fill
            //console.log("Result: ");
            //console.log(resultArr);
            //showResult(resultArr);
            result = resultArr;
        } else
            alert("No results found!");
    }
    else { // search for generic places
        //console.log("Recommendations: ");
        //console.log(result[0][1]);
        result = result[0][1];
    }

    if (result.length > 0) {
        console.log(result);
        showResult(result);
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
}

/*function searchRecursively(inputVal, entryArr, resArr) {
    //oldArr = [...oldArr, ...newArr]
    if (Object.hasOwn(entryArr, "name")) {
        if (entryArr.name.toLowerCase() === inputVal) {
            if (Object.hasOwn(entryArr, "cities")) {
                resArr = [...resArr, ...entryArr.cities];
                return;
            }

            resArr.push(entryArr);
            return;
        }
    }

    if(Array.isArray(entryArr) && entryArr.length > 0)
        entryArr.forEach(el => searchRecursively(inputVal, el, resArr));
}*/