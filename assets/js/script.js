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
}