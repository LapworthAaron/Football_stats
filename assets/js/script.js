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
    // create table and append to league table section
    var table = $('<table>').attr('id','dynamicTable');
    $('#leagueTable').append(table);

    // create all the headers for the table and append to the table
    var header = $('<tr>');
    table.append(header);
    var pos = $('<th>').text('Position').attr('class','position');
    var logo = $('<th>').text('Logo').attr('class','logo');
    var team = $('<th>').text('Team').attr('class','team');
    var played =$('<th>').text('Played').attr('class','played');
    var wins =$('<th>').text('Wins').attr('class','wins');
    var draws =$('<th>').text('Draws').attr('class','draws');
    var loses =$('<th>').text('Loses').attr('class','loses');
    var gd =$('<th>').text('Goal Diff').attr('class','goalDiff');
    var gf =$('<th>').text('GF').attr('class','gf');
    var ga =$('<th>').text('GA').attr('class','ga');
    var points =$('<th>').text('Points').attr('class','points');
    var form =$('<th>').text('Form').attr('class','form');
    var desc =$('<th>').text('Info').attr('class','info');
    
    header.append(pos,logo,team,played,wins,draws,loses,gd,gf,ga,points,form,desc);
    return;    
}

// dynamically create the table contents, looping through the response object array
function leagueTableContents() {
    
}