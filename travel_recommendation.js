const input = document.getElementById("search-input");
document.getElementById("search-btn").onclick = searchCommand;

async function searchCommand() {
    let inputVal = input.value.toLowerCase();
    if (inputVal == "") return;

    try {
        const response = await fetch("./travel_recommendation_api.json", {method: "GET"});
        if (!response.ok) throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        const resultVal = searchAPI(inputVal, result);
    }
    catch(error) {
        throw new Error(error.message);
    }
}

function searchAPI(inputVal, api) {
    console.log("input: " + inputVal);
    console.log(api);
}