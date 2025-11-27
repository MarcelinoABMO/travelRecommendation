const input = document.getElementById("search-input");
document.getElementById("search-btn").onclick = searchCommand;

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
    console.log("input: " + inputVal);
    console.log(api);

    inputVal = inputVal.toLowerCase();

    const entries = Object.entries(api);
    console.log("Entries: ");
    console.log(entries);
    const result = entries.filter(([k, v]) => k.toLowerCase() === inputVal);
    if (!result || result.length === 0){ // search for specific place
        let resultArr = [];
        resultArr = entries.filter(([k, v]) => k === "countries")[0][1]
            .filter(el => el.name.toLowerCase() === inputVal)[0].cities;
        console.log(resultArr);
        if (resultArr.length > 0) {
            //TODO: UI fill
            console.log("Result: ");
            console.log(resultArr);
        } else
            alert("No results found!");
    }
    else { // search for generic places
        console.log("Recommendations: ");
        console.log(result[0][1]);
        //TODO: se tiver cities, concatenar
    }
}

function searchRecursively(inputVal, entryArr, resArr) {
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
}