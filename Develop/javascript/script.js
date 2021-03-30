var form = document.getElementById("form");
var searchWord = document.getElementById("searchWord");
var wordSearchResultsDiv = document.getElementById("wordSearchResults");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    wordFromOWLBOTAPI(searchWord.value);
})
function wordFromOWLBOTAPI(userGivenWord) {
    var owlbotAPI = "https://owlbot.info/api/v4/dictionary/" + userGivenWord;
    // if ((userGivenWord == null) || (userGivenWord = " ")) { // Validation
    //     alert("You did not enter any!");
    //     return;
    // }
    fetch(owlbotAPI, {
        headers: {
            // curl --header "Authorization: Token 7579a9494dc6e8c7dfe3950082080d08db6a2b08"
            //  https://owlbot.info/api/v4/dictionary/owl -s | json_pp
            "Authorization": "Token 7579a9494dc6e8c7dfe3950082080d08db6a2b08"
        },
    })
        .then(function (response1) {
            if (response1.status === 404) {
                alert("Sorry, " + userGivenWord + " is not in owlbot API dictionary");
                return;
            } else if (response1.status === 400) {
                alert("Invalid");
                return;
            }
            return response1.json();
        })
        .then(function (owlbotObj) {
            console.log(owlbotObj);
            getAndDisplayOwlBotResults(owlbotObj);
        })
}

function getAndDisplayOwlBotResults(searchResults) {
    wordSearchResultsDiv.innerHTML = "";
    ((wordSearched = document.createElement("h3")).textContent = searchResults.word);
    ((wordPronunciation = document.createElement("p")).textContent = " / " + searchResults.pronunciation + " /");
    wordSearchResultsDiv.appendChild(wordSearched);
    wordSearched.appendChild(wordPronunciation);

    for (var x = 0; x < searchResults.definitions.length; x++) {
        ((wordSearchedType = document.createElement("p")).textContent = searchResults.definitions[x].type);
        wordSearchedType.classList.add("wordType");
        ((wordSearchedDefinition = document.createElement("p")).textContent = searchResults.definitions[x].definition);
        ((wordSearchedExample = document.createElement("p")).textContent = searchResults.definitions[x].example);
        ((wordSearchedEmoji = document.createElement("p")).textContent = searchResults.definitions[x].emoji);
        ((wordSearchedIMG = document.createElement("img")).src = searchResults.definitions[x].img_url);
        wordSearchedIMG.width, wordSearchedIMG.height = "100";

        wordSearchResultsDiv.appendChild(wordSearchedType);
        wordSearchResultsDiv.appendChild(wordSearchedDefinition);
        wordSearchResultsDiv.appendChild(wordSearchedEmoji);
        wordSearchResultsDiv.appendChild(wordSearchedExample);
        wordSearchResultsDiv.appendChild(wordSearchedIMG);
    }

}
function clearContentTextArea(element) {
    element.value = "";
}