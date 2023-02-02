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
    for (var i = 0; i < response.table.length; i++) {
        var tableRow = $('<tr>');
        var pos = $('<td>').text(response.table[i].intRank).attr('class','position rowPosition');
        var logo = $('<td>').attr('class','logo');
        var logoH = $('<img>').attr({'src':response.table[i].strTeamBadge,
                                    'width':'25px'});
        logo.append(logoH);
        var team = $('<td>').text(response.table[i].strTeam).attr('class','team');
        var played =$('<td>').text(response.table[i].intPlayed).attr('class','played');
        var wins =$('<td>').text(response.table[i].intWin).attr('class','wins');
        var draws =$('<td>').text(response.table[i].intDraw).attr('class','draws');
        var loses =$('<td>').text(response.table[i].intLoss).attr('class','loses');
        var gd =$('<td>').text(response.table[i].intGoalDifference).attr('class','goalDiff');
        var gf =$('<td>').text(response.table[i].intGoalsFor).attr('class','gf');
        var ga =$('<td>').text(response.table[i].intGoalsAgainst).attr('class','ga');
        var points =$('<td>').text(response.table[i].intPoints).attr('class','points');
        var form =$('<td>').attr('class','form');
        //for loop to create individual elements for each game in the form, so we can have conditional formatting
        for (var j = 0; j < 5; j++){
            var div = $('<div>');
            if (response.table[i].strForm[j] === 'W') {
                div.text(response.table[i].strForm[j]).attr('class','formGreen');
            } else if (response.table[i].strForm[j] === 'L') {
                div.text(response.table[i].strForm[j]).attr('class','formRed');
            } else {
                div.text(response.table[i].strForm[j]);
            }
            form.append(div);
        }
        var desc =$('<td>').text(response.table[i].strDescription).attr('class','info');
        $('#dynamicTable').append(tableRow);
        logo.append(logoH);
        tableRow.append(pos,logo,team,played,wins,draws,loses,gd,gf,ga,points,form,desc);
    }
}