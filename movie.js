/**
 * Created by Matt on 6/28/2017.
 */


function MovieList() {

    //  Variables
    var movies;
    var movieIndex;
    var movie_api_key = "1c7597f95f188897693c3ccde9dc7a66";
    var genres = [{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 16, "name": "Animation"}, {"id": 35, "name": "Comedy"}, {"id": 80, "name": "Crime"}, {"id": 99, "name": "Documentary"}, {"id": 18, "name": "Drama"}, {"id": 10751, "name": "Family"}, {"id": 14, "name": "Fantasy"}, {"id": 36, "name": "History"}, {"id": 27, "name": "Horror"}, {"id": 10402, "name": "Music"}, {"id": 9648, "name": "Mystery"}, {"id": 10749, "name": "Romance"}, {"id": 878, "name": "Science Fiction"}, {"id": 53, "name": "Thriller"}, {"id": 10752, "name": "War"}, {"id": 37, "name": "Western"}]

    /* -------------------------------Initialize Page Function ------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    this.init = function() {
        // Get movies
        this.getNewMovieList('popular');

        // Loop through genres array and add options onto dropdown menu
        for(var i = 0; i < genres.length; i++) {
            var option = $("<option>").attr("value", genres[i].id).text(genres[i].name);
            $("#genre-menu").append(option);
        }
    };


    /* -------------------------------Get New Movies Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    this.getNewMovieList = function(type, inputData){
        var url;
        // Get URL based on function parameters
        switch(type) {
            case "popular":
                url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + movie_api_key + '&language=en-US&page=1';
                $("#movie-list-title").text("In Theaters Now");
                break;
            case "search":
                url = "https://api.themoviedb.org/3/search/movie?api_key=" + movie_api_key + "&language=en-US&query=" + inputData + "&page=1&include_adult=false";
                $("#movie-list-title").text("Showing results for : " + inputData);
                break;
            case "genre":
                url = "https://api.themoviedb.org/3/genre/" + inputData + "/movies?api_key=1c7597f95f188897693c3ccde9dc7a66&language=en-US&include_adult=false&sort_by=created_at.asc";
                for(var i = 0; i < genres.length; i++) {
                    if(genres[i].id == inputData) {
                        var genreName = genres[i].name;
                    }
                }
                $("#movie-list-title").text(genreName);
                break;
        }

        // AJAX call to get movies object
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(result) {
                movies = result.results;
                loadMainPage();
            },
            error: function(err) {
                console.log(err);
            }
        })
    };

    /* ----------------------------------------Load Main Page Function---------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function loadMainPage() {

        $.ajax({
            url: "main.html",
            success: function(data) {
                $("#main-content").html(data);
                displayMovies();
            }
        })
    }

    /* ----------------------------------------Load Review Page Function---------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function loadReviewPage(){
        $.ajax({
            url: "review.html",
            success: function(data) {
                $("#main-content").html(data);
                reddit();
                youTube();
                movieInfo();
            }
        });
    }


    /* -------------------------------Display Movies Function -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function displayMovies(){

        // Loop through movies array and add each to the DOM
        for(var i=0; i < movies.length; i++){
            // Create image
            var image = $("<img>").addClass("fade").attr("src", "https://image.tmdb.org/t/p/original" + movies[i].poster_path);

            // Create modal
            var modal = $("<div>").addClass("movie_modal hidden_div");
            $("<div>").html(movies[i].title).appendTo(modal);
            var modal_description = $("<div>").addClass("modal_description").html(movies[i].overview).appendTo(modal);
            // Create container for image
            var img_container = $("<div>").addClass("contain-poster").css("position","relative").append(modal, image).appendTo(".container");
            img_container.attr("index",i);

            // Add click listener to container that loads the review page
            img_container.click(function(){
                movieIndex = $(this).attr("index");
                loadReviewPage();
            });

            // Hover functionality
            image.mouseenter(function(){
                // console.log(this);
                // $(this).addClass("overlay");
                $(this).parent(".contain-poster").children(".movie_modal").removeClass("hidden_div");
            });
            image.mouseleave(function(){
                // console.log(this);
                // $(this).removeClass("overlay");
                $(this).parent(".contain-poster").children(".movie_modal").addClass("hidden_div");
            });
        }
    };

    /* -------------------------------Movie Info Function ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------- */
    function movieInfo() {

        // Ajax call to get the movie info
        $.ajax({
           url:"https://api.themoviedb.org/3/movie/" + movies[movieIndex].id + " /credits?api_key=" + movie_api_key,
            success: function(result){
               // Add info to DOM
               $(".cast-div > span").html(result.cast[0].name + ", " + result.cast[1].name + ", " + result.cast[2].name + ", " + result.cast[3].name);
               for(var i=0; i<result.crew.length; i++){
                   if(result.crew[i].job === "Director"){
                       $(".director-div > span").html(result.crew[i].name);
                   }
               }
            }
        });

        // Set the html content
        $(".movie-title").html(movies[movieIndex].title);
        $(".description-div > span").html(movies[movieIndex].overview);
        $(".contain-img").css("background-image","url(https://image.tmdb.org/t/p/original" + movies[movieIndex].poster_path+ ")");
        $(".rating-div > span").html(movies[movieIndex].vote_average + "/10");
    };


    /* ------------------------------ Reddit Function ---------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------- */
    function reddit() {
        // Get title from movie object and split it into an array
        var title = movies[movieIndex].original_title;
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
                console.log("result: ", result);
                getDiscussion(result);
            },
            error: function(error) {
                failSafe(error);
                return;
            }
        });

        // Given the URL, find the discussion
        function getDiscussion(data) {
            try {
                var url = null;
                // Get URL from top post on page
                // var url = data.data.children[0].data.url;
                // Loop through posts and see if any of them contain the movie title
                for(var i = 0; i < data.data.children.length; i++){
                    var postTitle = data.data.children[i].data.title.toLowerCase();
                    if(postTitle.includes(title.toLowerCase())) {
                        url = data.data.children[i].data.url;
                        console.log("haha: ", url);
                        break;
                    }
                }
                if(url === null){
                    throw new Error("No movie discussion found.");
                }
            } catch(err){
                failSafe(err);
                return;
            }

            // Add .json to use the API
            var sort = "?sort=confidence";
            var newURL = url + ".json";
            console.log("newURL: ", newURL);
            // Ajax call to get the discussion page json
            $.ajax({
                url: newURL,
                dataType: 'json',
                method: 'GET',
                success: function(result) {
                    getComments(result);
                },
                error: function(result) {
                    failSafe(result);
                    return;
                }
            })
        }

        // Get the comments from
        function getComments(data){
            // Loop to get all the comments out of the data
            console.log("data: ",data);
            var comments = [];
            for(var i = 0; i < data[1].data.children.length; i++) {
                var comment = data[1].data.children[i].data.body;
                comments.push(comment);
            }
            displayComments(comments);
        }

        // Loop through comments and append them to the DOM
        function displayComments(comments) {
            count = 0;
            console.log("comments: ",comments);
            for(var i = 0; i < comments.length; i++) {
                if(comments.length < 10){
                    if(comments[i]=== undefined || comments[i] == '[deleted]') {  // ||  comments[i].length < 400 || comments[i].length > 1000
                        continue;
                    }
                    count++;
                    var commentDiv = $("<div>").addClass("comment").text(comments[i]);
                    $("#reddit-container").append(commentDiv);
                }
                else{
                    if(count > 9) {
                        break;
                    }
                    if(comments[i]=== undefined || comments[i].length < 400 || comments[i].length > 1000) {
                        continue;
                    }
                    count++;
                    var commentDiv = $("<div>").addClass("comment").text(comments[i]);
                    $("#reddit-container").append(commentDiv);
                }
            }
            if( count === 0){
                failSafe("No movie discussion found.");
            }
        }

        // This will run if the reddit function fails at some point
        function failSafe(error) {
            console.log("failsafe: ", error);
            var fail = $("<div>").addClass("fail").text("Reddit doesn't have much to say about this movie");
            $("#reddit-container").append(fail);
        }
    }




    /* -------------------------------- YouTube Function ------------------------------------------------  */
    /* --------------------------------------------------------------------------------------------------- */
    function youTube(){
        // Generates video IFrames for youtube videos
        function displayYouTubeResults(videoArray){
            for(var i = 0; i < videoArray.length;i++){
                var ytIframe = $('<iframe>').attr({
                    src: 'https://www.youtube.com/embed/' + videoArray[i].id,
                    frameborder: '0',
                    allowfullscreen: ''
                });
                $('.iframeWrapper').append(ytIframe);
            }
        }
        // Searches youtube for movie title + movie review
        function searchYouTube(movieObj){
            $.ajax({
                dataType : 'json',
                method: 'POST',
                url: 'https://s-apis.learningfuze.com/hackathon/youtube/search.php',
                data: {
                    q: movieObj.title + 'movie review',
                    maxResults: 10,
                    type: 'video',
                    detailLevel: 'low'
                },
                success : function(result){
                    //console.log(result.video);d
                    displayYouTubeResults(result.video);
                    var ytTitle =  $('<p>').text('Top YouTube Reviews of ' + movieObj.title);
                    $('.ytTitle').append(ytTitle);
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
        try{
            searchYouTube(movies[movieIndex]);
        } catch(err){
            failSafe(err);
            return;
        }
    }

}

