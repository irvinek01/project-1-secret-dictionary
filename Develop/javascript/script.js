var apiKey = "563492ad6f9170000100000177a465d3b96f4c42ada52578bcec403f"; // API key from Nick
var pictureContainer = document.getElementById("picture-container");

function imageSearch(searchTerm) {
    $.ajax({
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", apiKey);
        },
        url: "https://api.pexels.com/v1/search?query=" + searchTerm + "&per_page=15&page=1",
        success: function (data) {
            // console.log(data);
            pictureContainer.innerHTML = "";
            printImage(data);
            printImageSmall(data);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function printImage(data) {

    var firstRow = document.createElement("div");
    firstRow.setAttribute("class", "row");
    firstRow.setAttribute("style", "max-height:800px;display:flex;justify-content:center;");

    var firstRowDiv = document.createElement("div");
    firstRowDiv.setAttribute("style", "position:relative;max-height:100%;display:flex;justify-content:center;");
    firstRowDiv.setAttribute("class", "padded");

    var firstPic = document.createElement("img");
    firstPic.setAttribute("src", data.photos[0].src.original);
    firstPic.setAttribute("style", "max-height:100%;border-radius:50px;");
    firstPic.setAttribute("class", "sample-image");

    var link = document.createElement("a");
    link.setAttribute("href", data.photos[0].url);
    link.setAttribute("target", "_blank");
    link.setAttribute("class", "absolute bottom half-padded authorLink double-gap-bottom small");
    link.textContent = "Picture taken by: " + data.photos[0].photographer;

    firstRowDiv.appendChild(firstPic);
    firstRowDiv.appendChild(link);
    firstRow.appendChild(firstRowDiv);
    pictureContainer.appendChild(firstRow);
}

function printImageSmall(data) {

    var secondRow = document.createElement("div");
    secondRow.setAttribute("class", "row");
    secondRow.setAttribute("id","second-row");
    secondRow.setAttribute("style", "max-height:500px;");

    for (var i = 1; i < 4; i++) {

        var secondRowDiv = document.createElement("div");
        secondRowDiv.setAttribute("style", "position:relative;max-height:100%;display:flex;justify-content:center;");
        secondRowDiv.setAttribute("class", "padded one third ipad");

        var secondPic = document.createElement("img");
        secondPic.setAttribute("src", data.photos[i].src.original);
        secondPic.setAttribute("style", "border-radius:25px;");
        secondPic.setAttribute("class", "sample-image");

        var link = document.createElement("a");
        link.setAttribute("href", data.photos[i].url);
        link.setAttribute("target", "_blank");
        link.setAttribute("class", "absolute bottom half-padded authorLink double-gap-bottom small");
        link.textContent = "Picture taken by: " + data.photos[i].photographer;

        secondRowDiv.appendChild(secondPic);
        secondRowDiv.appendChild(link);
        secondRow.appendChild(secondRowDiv);
    }
    pictureContainer.appendChild(secondRow);
}

var form = document.getElementById("form");
var searchWord = document.getElementById("searchWord");
var wordSearchResultsDiv = document.getElementById("wordSearchResults");
var wordSearchResultsHeader = document.getElementById("wordHeader");
var wordSearchResultsBody = document.getElementById("wordBody");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    wordFromMerriamCollegiate(searchWord.value);
    SynAndAntoFromMerriamCollegiate(searchWord.value);
    imageSearch(searchWord.value);
})
function wordFromMerriamCollegiate(userGivenWord) {
    var merriamCollegiateAPI = "https://dictionaryapi.com/api/v3/references/collegiate/json/" + userGivenWord
        + "?key=f4f2439f-643d-4825-9607-56a27f613896"; // AJ MerriamCollegiateAPI
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
                        wordSearchResultsHeader.innerHTML = "";
                        wordSearchResultsBody.innerHTML = "";
                    }
                });
            } else {
                alert("Cannot found");
            }
        })
}

function getAndDisplayWord(searchResults) {
    wordSearchResultsHeader.innerHTML = "";
    firstResult = searchResults[0]; // Assigned the array data from response to firstResult
    // console.log(firstResult);
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

    wordSearchResultsHeader.appendChild(wordSearched);
    wordSearched.appendChild(wordType);
    wordType.appendChild(spanForWordPRS);
    spanForWordPRS.appendChild(wordPronunciation);
    wordPronunciation.appendChild(audio);
    if (firstResult.ins) { // Checks for plural forms, ISSUE IL
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
    for (var i = 0; i < firstResult.shortdef.length; i++) {
        wordDefinitions = document.createElement("li");
        wordDefinitions.classList.add("padded", "quicksand", "wordDefinitions");
        wordDefinitions.textContent = firstResult.shortdef[i];
        wordDefinitionTitle.appendChild(wordDefinitions);
    }
    wordSearchResultsBody.appendChild(wordDefinitionTitle);
    hrAfterDefinition = document.createElement("hr");
    wordDefinitions.appendChild(hrAfterDefinition);

    searchWord.value = "";
}

function SynAndAntoFromMerriamCollegiate(userGivenWord) {
    var merriamthesaurusAPI = "https://dictionaryapi.com/api/v3/references/thesaurus/json/" + userGivenWord
        + "?key=b99aa4f1-0306-436d-ae05-cb4ddae328a0"; // API from Nick
    fetch(merriamthesaurusAPI)
        .then(function (response2) {
            // console.log(response1.status);
            if (response2.ok) {
                response2.json().then(function (data) {
                    console.log(data);
                    if (data[0].meta) { // Checking if the word is a legit
                        getAndDisplaySynAndAnt(data);
                    } else {
                        alert("Sorry, No Synonyms/Antonyms can be found");
                    }
                });
            } else {
                alert("Cannot found");
            }
        })
}

function getAndDisplaySynAndAnt(data) {
    wordSynTitle = document.createElement("h3");
    wordSynTitle.classList.add("padded", "quicksand");
    wordSynTitle.innerHTML = "Synonym(s): <br>";
    wordSearchResultsBody.appendChild(wordSynTitle);
    wordSyn = document.createElement("p");
    wordSyn.classList.add("padded", "quicksand", "wordDefinitions");
    if (data[0].meta.syns.length == 0) {
        wordSyn.textContent = "Not available";
    } else {
        for (var i = 0; i < data[0].meta.syns[0].length; i++) {
            wordSyn.textContent += data[0].meta.syns[0][i] + ", ";
        }
    }
    wordSynTitle.appendChild(wordSyn);

    wordAntTitle = document.createElement("h3");
    wordAntTitle.classList.add("padded", "quicksand");
    wordAntTitle.innerHTML = "Antonym(s): <br>";
    wordSearchResultsBody.appendChild(wordAntTitle);
    wordAnt = document.createElement("p");
    wordAnt.classList.add("padded", "quicksand", "wordDefinitions");
    if (data[0].meta.ants.length == 0) {
        wordAnt.textContent = "Not available";
    } else {
        for (var i = 0; i < data[0].meta.ants[0].length; i++) {
            wordAnt.textContent += data[0].meta.ants[0][i] + ", ";
        }
    }
    wordAntTitle.appendChild(wordAnt);

     wordExampleTi = document.createElement("h3");
    wordExampleTi.classList.add("padded", "quicksand");
    wordExampleTi.innerHTML = "Example: <br>";

    if (firstResult.quotes) {
        for (var i = 0; i < firstResult.quotes.length; i++) {
        var wordExample = document.createElement ("li");
        wordExample.classList.add("padded", "quicksand", "wordDefinitions");
        wordExample.innerHTML = firstResult.quotes[i].t.replaceAll("{qword}", "").replaceAll("{/qword}", "") + "<br><br>-"; 
        var wordRep = document.createElement ("em");
        wordRep.innerHTML = firstResult.quotes[i].aq.auth; 
        wordExample.appendChild(wordRep);
        wordExampleTi.appendChild(wordExample)
        }
    } else {
        wordExampleTi.innerHTML = "Example: <br> No examples found to display.";
        }   
    
    wordSearchResultsBody.appendChild(wordExampleTi);
}

function clearContentTextArea(element) {
    element.value = "";
}
