
console.log("before initialization");
// popular movies list
var api_key = "1c7597f95f188897693c3ccde9dc7a66";



function displayMovies(popular_movies){
    // console.log("poop: ",popular_movies);
    for(var i=0; i < popular_movies.length; i++){

        var image = $("<img>").attr("src", "https://image.tmdb.org/t/p/original" + popular_movies[i].poster_path);
        var img_link = $("<a>", {href: "review.html"}).append(image);
        // var img_container = $("<div>").append(image).appendTo(".container");
        var img_container = $("<div>").addClass("col-xs-12 col-md-2").append(img_link).appendTo(".contain_movies");

        img_container.attr("index",i);
        img_container.click(function(){
           movie_index = $(this).attr("index");
            // movieInfo(popular_movies[movie_index]);
            // reddit(popular_movies[movie_index]);
            //have access to popular_movies[i]\
            // doStuff(i, popular_movies);
            // function doStuff(i,popular_movies){
            //     var local_i = i;
            //     console.log("local_i: " + local_i);
            //     movieInfo(popular_movies[local_i]);
            //     reddit(popular_movies[local_i]);
            // }
            // console.log("i: ", i);
            // console.log("popular movies: ", popular_movies);
            // movieInfo(popular_movies[i]);
            // reddit(popular_movies[i]);
        });
    }
};

// function doStuff(i, popular_movies){
//     var local_i = i;
//     console.log("local_i: " + local_i);
//     movieInfo(popular_movies[local_i]);
//     reddit(popular_movies[local_i]);
// };

//movie portion

function movieInfo(movieObj){
    console.log("inside movieinfo function");

};

//reddit portion

function reddit(movie) {
    console.log("movie: ",movie);
    // Get title from movie object and split it into an array
    var title = movie.original_title;
    var titleArray = title.split(" ");

    // Declare some variables
    var redditURL = "https://www.reddit.com/r/movies/search.json?q=";
    var URLcap = "&restrict_sr=on";

    // Create reddit URL
    for (var i = 0; i < titleArray.length; i++) {
        redditURL += titleArray[i] + "+";
    }
    redditURL += "discussion";
    redditURL += URLcap;
    console.log("redditURL: ", redditURL);

    // Ajax call to search reddit.com/r/movies for the movie discussion page
    $.ajax({
        url: redditURL,
        dataType: 'json',
        method: 'GET',
        success: function(result) {
            console.log("Successfully connected to reddit");
            getDiscussion(result);
        },
        error: function(result) {
            console.log("ERROR");
            console.log(result);
        }
    });

    function getDiscussion(data) {
        // Get URL from top post on page
        var url = data.data.children[0].data.url;

        // Add .json to use the API
        var newURL = url + ".json";

        // Ajax call to get the discussion page json
        $.ajax({
            url: newURL,
            dataType: 'json',
            method: 'GET',
            success: function(result) {
                console.log("Successfully connected to reddit");
                getComments(result);
            },
            error: function(result) {
                console.log("ERROR");
                console.log(result);
            }
        })
    }

    function getComments(data){

        // Loop to get all the comments out of the data
        var comments = [];
        for(var i = 0; i < data[1].data.children.length; i++) {
            var comment = data[1].data.children[i].data.body;
            comments.push(comment);
        }
        displayComments(comments);
    }

    function displayComments(comments) {
        for(var i = 0; i < comments.length; i++) {
            var commentDiv = $("<div>").addClass("comment").text(comments[i]);
            $("#reddit-container").append(commentDiv);
        }
    }
};

//youtube portion

function youTube(movieObj){
    function displayYouTubeResults(videoArray){
        for(var i = 0; i < videoArray.length;i++){
            var ytIframe = $('<iframe>').attr({
                src: 'https://www.youtube.com/embed/' + videoArray[i].id,
                width: '560',
                height: '315',
                frameborder: '0',
                allowfullscreen: null,
            });
            $('#youtube-container').append(ytIframe);
        }
    }
    function searchYouTube(movie_Obj){
        $.ajax({
            dataType : 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/hackathon/youtube/search.php',
            data: {
                q: movie_Obj.original_title,
                maxResults: 3,
                type: 'video',
                detailLevel: 'low'
            },
            success : function(result){
                console.log(result.video);
                displayYouTubeResults(result.video);
            },
            error: function(err){
                console.log(err);
            }
        })
    }
    searchYouTube(movieObj)
}


$.ajax({
    url: "https://api.themoviedb.org/3/search/movie?api_key=1c7597f95f188897693c3ccde9dc7a66&language=en-US&query=anchorman&page=1&include_adult=false"

})




