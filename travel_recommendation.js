const input = document.getElementById("search-input");
document.getElementById("search-btn").onclick = searchCommand;

function searchCommand() {
    let inputVal = input.value.toLowerCase();
    if (inputVal == "") return;

    fetch("./travel_recommendation_api.json", {method: "GET"})
        .then(response => {
            const result = JSON.parse(response);
            const resultVal = searchAPI(inputVal, result);
        }).catch(error => {
            console.log(error);
        });
}

function searchAPI(inputVal, api) {
    console.log("input: " + inputVal);
    console.log(api);
}