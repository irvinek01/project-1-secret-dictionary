$(document).ready(function () {
    var apiKey = "563492ad6f9170000100000177a465d3b96f4c42ada52578bcec403f";
    var searchTerm = "dog";
    imageSearch();
    function imageSearch() {
        $.ajax({
            method: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", apiKey);
            },
            url: "https://api.pexels.com/v1/search?query=" + searchTerm + "&per_page=15&page=1",
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
})
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
            // console.log(response1.status);
            if (response1.ok) {
                response1.json().then(function (data) {
                    // console.log(data);
                    if (data[0].fl) { // Checking if the word is a legit
                        getAndDisplayWord(data);
                    } else {
                        alert("Sorry, " + userGivenWord + " cannot be found");
                    }
                });
            } else {
                alert("Cannot found");
            }
        })
}

function getAndDisplayWord(searchResults) {
    wordSearchResultsHeader.innerHTML = "";
    firstResult = searchResults[0];
    console.log(firstResult);
    wordSearched = document.createElement("h2");
    wordSearched.textContent = searchWord.value;
    wordSearched.classList.add("padded", "museo-slab");

    wordType = document.createElement("em");
    wordType.textContent = " ( " + firstResult.fl + " ) ";
    wordType.classList.add("padded", "museo-slab", "wordType");

    spanForWordPRS = document.createElement("span");
    wordPronunciation = document.createElement("button");
    audio = document.createElement("audio");
    audioFile = firstResult.hwi.prs[0].sound.audio;
    // if audiofil begins w bix, firstLet is bix
    // else if, begins w gg, firstLet is gg
    // else if begins w number or punctuation (eg, "_"), firstlet is number
    // else firstLet is firstLet
    var specialAndNumChars = "!@#$%^&*()_+~`|}{[]\:;?><,./-=0123456789";
    if (audioFile.substring(0, 3) === "bix") {
        dirFolder = "bix";
    } else if (audioFile.substring(0, 2) === "gg") {
        dirFolder = "gg";
    } else if (specialAndNumChars.includes(audioFile.charAt(0))) {
        dirFolder = "number";
    } else {
        dirFolder = audioFile.charAt(0);
    }
    audio.src = "https://media.merriam-webster.com/audio/prons/en/us/mp3/" + dirFolder + "/" + audioFile + ".mp3";
    wordPronunciation.textContent = firstResult.hwi.prs[0].mw;
    wordPronunciation.onclick = function () {
        audio.play();
    };
    // firstResult.hwi.prs[0].sound.audio this is the sound audio

    wordSearchResultsHeader.appendChild(wordSearched);
    wordSearched.appendChild(wordType);
    wordType.appendChild(spanForWordPRS);
    spanForWordPRS.appendChild(wordPronunciation);
    wordPronunciation.appendChild(audio);
    if (firstResult.ins) {
        inflectionLabel = document.createElement("em");
        inflectionSpelled = document.createElement("b");
        inflectionLabel.textContent = firstResult.ins[0].il + " ";
        inflectionSpelled.textContent = firstResult.ins[0].if;
        wordSearchResultsHeader.appendChild(inflectionLabel);
        inflectionLabel.appendChild(inflectionSpelled);
    }

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
