var leagues = {'English_Premier_League':4328,
               'The_Championship':4329,
               'League_One':4396,
               'League_Two':4397};

var tableUrl = 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?';
var scheduleUrl = 'https://www.thesportsdb.com/api/v1/json/3/eventsround.php?';
var playerUrl = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?';


///////////////////////////
// League table section
///////////////////////////
// tab clicks call functions
$('#leagueTableTab').on('click',showLeaguePage);
$('#scheduleTab').on('click',showSchedulePage);
$('#playerSearchTab').on('click',showPlayerPage);
$('#landingBtn').on('click', function (){
    window.location.reload()
});



// show or hide the relevant content for league tables
function showLeaguePage() {
    hideShow('show',
        'show','show','hidden','hidden',
        'show','hidden','hidden',
        'hidden','show','hidden','hidden');

    $('#updateBtnLeague').unbind('click').on('click',leagueTable);
}
// show or hide the relevant content for schedules
function showSchedulePage() {
    hideShow('show',
        'show','show','show','hidden',
        'hidden','show','hidden',
        'hidden','hidden','show','hidden');

    gameweekGenerate();
    $('#leagues').on('change',gameweekGenerate);
    $('#updateBtnSchedule').unbind('click').on('click',scheduleRound);
}
// show or hide the relevant content for player searchs
function showPlayerPage() {
    hideShow('show',
        'hidden','hidden','hidden','show',
        'hidden','hidden','show',
        'hidden','hidden','hidden','show');

    $('#searchBtnPlayer').unbind('click').on('click',playerSearch);
}

function hideShow(fb,ld,sd,gd,psd,ubl,ubs,sbp,lp,lt,s,ps) {
    // banner
    $('#filterBanner').attr('class',fb);
    // dropdowns and text input
    $('#leagueDiv').attr('class',ld);
    $('#seasonDiv').attr('class',sd);
    $('#gameweekDiv').attr('class',gd);
    $('#playerSearchDiv').attr('class',psd);
    // update buttons and search button
    $('#updateBtnLeague').attr('class',ubl);
    $('#updateBtnSchedule').attr('class',ubs);
    $('#searchBtnPlayer').attr('class',sbp);
    // actual dynamic content sections
    $('#landingPage').attr('class',lp);
    $('#leagueTable').attr('class',lt).empty();
    $('#schedule').attr('class',s).empty();
    $('#playerSearch').attr('class',ps);
    //.empty();
}

///////////////////////////
// League table section
///////////////////////////
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
        leagueTableTemplate();
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
function leagueTableContents(response) {
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

///////////////////////////
// Schedule section
///////////////////////////
var gameweekArray = [];

//get the number of games in a season, epl is the only one with 38 games
function gameweekGenerate() {
    //update dropdown
    $('#gameweek').empty();
    if (leagues[$('#leagues').val()] === 4328) {
        arrayPop(38);
    } else {
        arrayPop(46);
    }

    for (var i = 0; i < gameweekArray.length; i++) {
        var option = $('<option>').attr('value',gameweekArray[i]).text(gameweekArray[i]);
        $('#gameweek').append(option);
    }
}

//push week numbers into an array to populate the 
function arrayPop(num) {
    gameweekArray = [];
    for (var i = 1; i <= num; i++) {
        gameweekArray.push(i);
    }
}

// empty schedule section, construct url and call ajax
function scheduleRound() {
    $('#schedule').empty();
    $('#schedule').attr('class','show');
    // set the api url
    var league = 'id=' + leagues[$('#leagues').val()];
    var year = '&s=' + $('#season').val();
    var week = '&r=' + $('#gameweek').val();
    var queryUrl = scheduleUrl + league + week + year;

    $.ajax({"url": queryUrl,
		"method": "GET"
	})
	.then(function (response) {
        // console.log(response);
		var yearH = $('<h2>').text('Season: ' + $('#season').val() );
		var roundH = $('<h2>').text('Gameweek: ' + $('#gameweek').val());

		$('#schedule').append(yearH, roundH);

        // dynamic update of the fixtures
		scheduleDynamic(response);
    });
    return;
}

// dynamically populate the html in the schedule section and add api data
function scheduleDynamic(response) {
    //loop through each fixture
    for (var i = 0; i < response.events.length; i++) {
        // create one heading for the details or date, time and venue for the match
        var rawDate = moment(response.events[i].dateEvent,"YYYY-mm-dd").format('Do MMM YYYY');
        var rawTime = moment(response.events[i].strTime,"HH:mm:ss").format('ha');
        var venue = response.events[i].strVenue;
        var logHeading = $('<h5>').text(rawDate + ' - ' + rawTime + ' @ ' + venue)
            .attr('class','fixtureLogistics');
        $('#schedule').append(logHeading);
        
        //get the fixtures and game detail
        if (response.events[i].intHomeScore != null) {
            var tableRow = $('<tr>').attr('class','fixtureTeam');
            $('#schedule').append(tableRow);
            var teamH = $('<td>').text(response.events[i].strHomeTeam);
            // middle section of scores and colon
            var scoreMiddle = $('<td>').attr('class','scoreMiddle');
            var scoreH = $('<h3>').text(response.events[i].intHomeScore);
            var colon = $('<h3>').text(" : ");
            var scoreA = $('<h3>').text(response.events[i].intAwayScore);
            scoreMiddle.append(scoreH, colon, scoreA);
            var teamA = $('<td>').text(response.events[i].strAwayTeam);
            tableRow.append(teamH, scoreMiddle, teamA);
        } else {
            var tableRow = $('<tr>').attr('class','fixtureTeam')
            $('#schedule').append(tableRow);
            var teamH = $('<td>').text(response.events[i].strHomeTeam);
            // middle section of just v
            var scoreMiddle = $('<td>').attr('class','scoreMiddle');
            var vs = $('<h3>').text(" v ");
            scoreMiddle.append(scoreH, vs, scoreA);
            var teamA = $('<td>').text(response.events[i].strAwayTeam);
            tableRow.append(teamH, scoreMiddle, teamA);
        }
        //TODO: add youtube button here with link to modal
    }
}


///////////////////////////
// Player Search section
///////////////////////////
// function to get player details and populate to screen
function playerSearch() {
    var playerInput = 'p=' + encodeURIComponent($('#playerSearchInput').val());
    var queryUrl = playerUrl + playerInput;
    console.log(playerInput);
    $('#playerSearch').empty();

    $.ajax({"url": queryUrl,
		"method": "GET"
	})
    .then(function (response) {
        if (response.player != null) {
            // console.log(response);
            var article = $('<article>').attr('id','playerResultsItem');
            $('#playerSearch').append(article);
            $('<h3>').text(' Search Results ').appendTo(article);

            //populate api data to HTML elements
            playerHtml(response);
        } else {
            var article = $('<article>').attr('id','playerResultsItem');
            $('#playerSearch').append(article);
            $('<h3>').text(' Search Results ').appendTo(article);
            $('<h4>').text('"' + $('#playerSearchInput').val() + '" does not exist ').appendTo(article);
        }
    });
}

// function to populate api data to HTML elements
function playerHtml(response) {
    var divBio = $('<div>').attr('id','playerBio')
    .appendTo($("#playerResultsItem"));
    var divInfo = $('<div>').attr('id','playerInfo')
    .appendTo(divBio);

    var img = $('<img>').attr({'id':'playerImg','class':'playerImg'});
    img.attr({'src':response.player[0].strThumb,'width':'250px'})
    .appendTo(divInfo);

    var name = $('<h3>').text('Name: ' + response.player[0].strPlayer);
    var bornDate = $('<h3>').text('DOB: ' + response.player[0].dateBorn);
    var bornLocation = $('<h3>').text('Born: ' + response.player[0].strBirthLocation);
    var nationality = $('<h3>').text('Nationality: ' + response.player[0].strNationality);
    var position = $('<h3>').text('Position: ' + response.player[0].strPosition);
    var team = $('<h3>').text('Team: ' + response.player[0].strTeam);
    divInfo.append(name, bornDate, bornLocation, nationality, position, team);
    
    var title = $('<h3>').text('Profile:');
    var desc = $('<h3>').text(response.player[0].strDescriptionEN);
    divBio.append(title, desc);
}