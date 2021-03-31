$(document).ready(function () {
    var apiKey="563492ad6f9170000100000177a465d3b96f4c42ada52578bcec403f";

    var searchTerm = "dog";

    imageSearch();

    function imageSearch() {
        $.ajax({
            method:"GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader ("Authorization", apiKey);
            },
            url:"https://api.pexels.com/v1/search?query=" + searchTerm + "&per_page=15&page=1",
            success: function(data) {
                console.log(data);
            },
            error:function(error) {
                console.log(error);
            }
        })
    }
})