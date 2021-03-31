var form = document.getElementById("form");
var searchWord = document.getElementById("searchWord");
var wordSearchResultsDiv = document.getElementById("wordSearchResults");
var wordSearchResultsHeader = document.getElementById("wordHeader");
var wordSearchResultsBody = document.getElementById("wordBody");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    wordFromMerriamCollegiate(searchWord.value);
})
function wordFromMerriamCollegiate(userGivenWord) {
    var merriamCollegiateAPI = "https://dictionaryapi.com/api/v3/references/collegiate/json/" + userGivenWord
        + "?key=f4f2439f-643d-4825-9607-56a27f613896";
    fetch(merriamCollegiateAPI)
        .then(function (response1) {
            if (response1.status === 404) {
                alert("Sorry, " + userGivenWord + " cannot be found");
                return;
            } else if (response1.status === 400) {
                alert("Invalid");
                return;
            }
            return response1.json();
        })
        .then(function (merriamCollegiateAPI) {
            // console.log(merriamCollegiateAPI);
            getAndDisplayWord(merriamCollegiateAPI);
        })
}

function getAndDisplayWord(searchResults) {
    wordSearchResultsHeader.innerHTML = "";
    firstResult = searchResults[0];
    console.log(firstResult);
    wordSearched = document.createElement("h2");
    wordSearched.textContent = firstResult.meta.id;
    wordSearched.classList.add("padded", "museo-slab");

    wordType = document.createElement("em");
    wordType.textContent = " ( " + firstResult.fl + " ) ";
    wordType.classList.add("padded", "museo-slab", "wordType");

    spanForWordPRS = document.createElement("span");
    wordPronunciation = document.createElement("button");
    audio = document.createElement("audio");
    audio.src = "https://media.merriam-webster.com/audio/prons/en/us/mp3/l/lion0001.mp3";
    wordPronunciation.textContent = firstResult.hwi.prs[0].mw;
    wordPronunciation.onclick = function () {
        audio.play();
    };
    // firstResult.hwi.prs[0].sound.audio this is the sound audio
    inflectionLabel = document.createElement("em");
    inflectionSpelled = document.createElement("b");
    inflectionLabel.textContent = firstResult.ins[0].il + " ";
    inflectionSpelled.textContent = firstResult.ins[0].if


    wordSearchResultsHeader.appendChild(wordSearched);
    wordSearched.appendChild(wordType);
    wordType.appendChild(spanForWordPRS);
    spanForWordPRS.appendChild(wordPronunciation);
    wordPronunciation.appendChild(audio);
    wordSearchResultsHeader.appendChild(inflectionLabel);
    inflectionLabel.appendChild(inflectionSpelled);

    wordSearchResultsBody.innerHTML = "";
    wordDefinitionTitle = document.createElement("h3");
    wordDefinitionTitle.classList.add("padded", "quicksand");
    wordDefinitionTitle.innerHTML = "Definition: <br>";
    console.log(firstResult.shortdef);
    for (var i = 0; i < firstResult.shortdef.length; i++) {
        wordDefinitions = document.createElement("li");
        wordDefinitions.classList.add("padded", "quicksand", "wordDefinitions");
        wordDefinitions.textContent = firstResult.shortdef[i];
        wordDefinitionTitle.appendChild(wordDefinitions);

    }
    wordSearchResultsBody.appendChild(wordDefinitionTitle);

}

function clearContentTextArea(element) {
    element.value = "";
}