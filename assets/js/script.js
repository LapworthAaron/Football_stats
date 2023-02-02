var leagues = {'English_Premier_League':4328,
               'The_Championship':4329,
               'League_One':4396,
               'League_Two':4397};

var tableUrl = 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?';

// create and display the league table dynamically
function leagueTable() {
    // set the api url
    var league = 'l=' + leagues[$('#leagues').val()];
    var year = '&s=' + $('#season').val();
    var queryUrl = tableUrl + league + year;

    //ajax api call
    $.ajax({"url": queryUrl,
            "method": "GET"
        })
    .then(function (response) {
        //create table and append to the league table section
        leagueTableTemplate(response);
        // dynamically create the table contents
        leagueTableContents(response);
    });
    // change class to display the table section
    $('#leagueTable').empty().attr('class','show');
}

// create the base table (headers), no actual data content
function leagueTableTemplate() {

}

// dynamically create the table contents, looping through the response object array
function leagueTableContents() {
    
}