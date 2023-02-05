var leagues = {
  English_Premier_League: 4328,
  The_Championship: 4329,
  League_One: 4396,
  League_Two: 4397,
};

var tableUrl = "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?";
var scheduleUrl = "https://www.thesportsdb.com/api/v1/json/3/eventsround.php?";
var playerUrl = "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?";

///////////////////////////
// League table section
///////////////////////////
// tab clicks call functions
$("#leagueTableTab").on("click", showLeaguePage);
$("#scheduleTab").on("click", showSchedulePage);
$("#playerSearchTab").on("click", showPlayerPage);
$("#landingBtn").on("click", function () {
  window.location.reload();
});

// show or hide the relevant content for league tables
function showLeaguePage() {
  hideShow(
    "show",
    "show",
    "show",
    "hidden",
    "hidden",
    "show",
    "hidden",
    "hidden",
    "hidden",
    "show",
    "hidden",
    "hidden"
  );

  $("#updateBtnLeague").unbind("click").on("click", leagueTable);
}
// show or hide the relevant content for schedules
function showSchedulePage() {
  hideShow(
    "show",
    "show",
    "show",
    "show",
    "hidden",
    "hidden",
    "show",
    "hidden",
    "hidden",
    "hidden",
    "show",
    "hidden"
  );

  gameweekGenerate();
  $("#leagues").on("change", gameweekGenerate);
  $("#updateBtnSchedule").unbind("click").on("click", scheduleRound);
}
// show or hide the relevant content for player searchs
function showPlayerPage() {
  hideShow(
    "show",
    "hidden",
    "hidden",
    "hidden",
    "show",
    "hidden",
    "hidden",
    "show",
    "hidden",
    "hidden",
    "hidden",
    "show"
  );
  getPlayerList();
  $("#searchBtnPlayer").unbind("click").on("click", playerSearch);
}

function hideShow(fb, ld, sd, gd, psd, ubl, ubs, sbp, lp, lt, s, ps) {
  // banner
  $("#filterBanner").removeClass("show hidden").addClass(fb);
  // dropdowns and text input
  $("#leagueDiv").removeClass("show hidden").addClass(ld);
  $("#seasonDiv").removeClass("show hidden").addClass(sd);
  $("#gameweekDiv").removeClass("show hidden").addClass(gd);
  $("#playerSearchDiv").removeClass("show hidden").addClass(psd);
  // update buttons and search button
  $("#updateBtnLeague").removeClass("show hidden").addClass(ubl);
  $("#updateBtnSchedule").removeClass("show hidden").addClass(ubs);
  $("#searchBtnPlayer").removeClass("show hidden").addClass(sbp);
  // actual dynamic content sections
  $("#landingPage").removeClass("show hidden").addClass(lp);
  $("#leagueTable").removeClass("show hidden").addClass(lt).empty();
  $("#schedule").removeClass("show hidden").addClass(s);
  $("#playerSearch").removeClass("show hidden").addClass(ps).empty();
}

///////////////////////////
// League table section
///////////////////////////
// create and display the league table dynamically
function leagueTable() {
  // set the api url
  var league = "l=" + leagues[$("#leagues").val()];
  var year = "&s=" + $("#season").val();
  var queryUrl = tableUrl + league + year;

  //ajax api call
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    //create table and append to the league table section
    leagueTableTemplate();
    // dynamically create the table contents
    leagueTableContents(response);
  });
  // change class to display the table section
  $("#leagueTable").empty().attr("class", "show");
}

// create the base table (headers), no actual data content
function leagueTableTemplate() {
  // create table and append to league table section
  var table = $("<table>").attr("id", "dynamicTable");
  $("#leagueTable").append(table);

  // create all the headers for the table and append to the table
  var header = $("<tr>");
  table.append(header);
  var pos = $("<th>").text("Position").attr("class", "position");
  var logo = $("<th>").text("Logo").attr("class", "logo");
  var team = $("<th>").text("Team").attr("class", "team");
  var played = $("<th>").text("Played").attr("class", "played");
  var wins = $("<th>").text("Wins").attr("class", "wins");
  var draws = $("<th>").text("Draws").attr("class", "draws");
  var loses = $("<th>").text("Loses").attr("class", "loses");
  var gd = $("<th>").text("Goal Diff").attr("class", "goalDiff");
  var gf = $("<th>").text("GF").attr("class", "gf");
  var ga = $("<th>").text("GA").attr("class", "ga");
  var points = $("<th>").text("Points").attr("class", "points");
  var form = $("<th>").text("Form").attr("class", "form");
  var desc = $("<th>").text("Info").attr("class", "info");

  header.append(
    pos,
    logo,
    team,
    played,
    wins,
    draws,
    loses,
    gd,
    gf,
    ga,
    points,
    form,
    desc
  );
  return;
}

// dynamically create the table contents, looping through the response object array
function leagueTableContents(response) {
  for (var i = 0; i < response.table.length; i++) {
    var tableRow = $("<tr>");
    var pos = $("<td>")
      .text(response.table[i].intRank)
      .attr("class", "position rowPosition");
    var logo = $("<td>").attr("class", "logo");
    var logoH = $("<img>").attr({
      src: response.table[i].strTeamBadge,
      width: "25px",
    });
    logo.append(logoH);
    var team = $("<td>").text(response.table[i].strTeam).attr("class", "team");
    var played = $("<td>")
      .text(response.table[i].intPlayed)
      .attr("class", "played");
    var wins = $("<td>").text(response.table[i].intWin).attr("class", "wins");
    var draws = $("<td>")
      .text(response.table[i].intDraw)
      .attr("class", "draws");
    var loses = $("<td>")
      .text(response.table[i].intLoss)
      .attr("class", "loses");
    var gd = $("<td>")
      .text(response.table[i].intGoalDifference)
      .attr("class", "goalDiff");
    var gf = $("<td>").text(response.table[i].intGoalsFor).attr("class", "gf");
    var ga = $("<td>")
      .text(response.table[i].intGoalsAgainst)
      .attr("class", "ga");
    var points = $("<td>")
      .text(response.table[i].intPoints)
      .attr("class", "points");
    var form = $("<td>").attr("class", "form");
    //for loop to create individual elements for each game in the form, so we can have conditional formatting
    for (var j = 0; j < 5; j++) {
      var div = $("<div>");
      if (response.table[i].strForm[j] === "W") {
        div.text(response.table[i].strForm[j]).attr("class", "formGreen");
      } else if (response.table[i].strForm[j] === "L") {
        div.text(response.table[i].strForm[j]).attr("class", "formRed");
      } else {
        div.text(response.table[i].strForm[j]);
      }
      form.append(div);
    }
    var desc = $("<td>")
      .text(response.table[i].strDescription)
      .attr("class", "info");
    $("#dynamicTable").append(tableRow);
    logo.append(logoH);
    tableRow.append(
      pos,
      logo,
      team,
      played,
      wins,
      draws,
      loses,
      gd,
      gf,
      ga,
      points,
      form,
      desc
    );
  }
}

///////////////////////////
// Schedule section
///////////////////////////
var gameweekArray = [];

//get the number of games in a season, epl is the only one with 38 games
function gameweekGenerate() {
  //update dropdown
  $("#gameweek").empty();
  if (leagues[$("#leagues").val()] === 4328) {
    arrayPop(38);
  } else {
    arrayPop(46);
  }

  for (var i = 0; i < gameweekArray.length; i++) {
    var option = $("<option>")
      .attr("value", gameweekArray[i])
      .text(gameweekArray[i]);
    $("#gameweek").append(option);
  }
}

//push week numbers into an array to populate the
function arrayPop(num) {
  gameweekArray = [];
  for (var i = 1; i <= num; i++) {
    gameweekArray.push(i);
  }
}

// ----------------------------------- TOM NEW SCHEDULE JS -----------------------------------------
// - Populate HTML table with Football API data 
// - create YouTube icons + onclicks with YoutTube API call based on Football data 
// - show and populate modal on YT click - modal close onclick for X and modal background as per expected behaviour   

function scheduleRound() {
  // set the api url
  var league = "id=" + leagues[$("#leagues").val()];
  var year = "&s=" + $("#season").val();
  var week = "&r=" + $("#gameweek").val();
  var queryUrl = scheduleUrl + league + week + year;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    $("#fixtureTableBody").empty();
    var fixtureTitle = $("#fixtureTitle");
    fixtureTitle.html(
      `<h1>Season: ${response.events[0].strSeason}</h1> <h2>Game Week: ${response.events[0].intRound}</h2>`
    );
    $("#tHead").html(`<tr>
            <th>Location</th>
            <th>Home Team</th>
            <th>Score</th>
            <th>Away Team</th>
            <th>Highlights</th>
          </tr>`);
    for (var i = 0; i < response.events.length; i++) {
      //   var rawDate = moment(response.events[i].dateEvent, "YYYY-mm-dd").format(
      //     "Do MMM YYYY"
      //   );
      var rawDate = response.events[i].dateEvent;
      var rawTime = moment(response.events[i].strTime, "HH:mm:ss").format("ha");
      var venue = response.events[i].strVenue;
      var homeT = response.events[i].strHomeTeam;
      var scoreH = response.events[i].intHomeScore;
      var scoreA = response.events[i].intAwayScore;
      var awayT = response.events[i].strAwayTeam;
      var fixtureRow = $("<tr>");
      fixtureRow.html(` <td>${venue}<br/>${rawDate} @ ${rawTime} </td>
            <td>${homeT}</td>
            <td>${scoreH} : ${scoreA}</td>
            <td>${awayT}</td>
            <td><img class="yticon" src="./assets/images/YT.PNG"/ data-date="${rawDate}" data-homeT="${homeT}" data-scoreH="${scoreH}" data-scoreA="${scoreA}" data-awayT="${awayT}"></td>`);
      $("#fixtureTableBody").append(fixtureRow);
    }

    const ytButtonsCollection = document.querySelectorAll(".yticon");
    const ytButtonsArray = Array.from(ytButtonsCollection);

    ytButtonsArray.forEach((button) => {
      button.addEventListener("click", (e) => {
        $("#modal-background").removeClass("hidden");
        const { date, homet, scoreh, awayt, scorea } = e.target.dataset;
        var search = `${date} ${homet} ${scoreh} : ${scorea} ${awayt}`;
        console.log(search);
        const settings = {
          async: true,
          crossDomain: true,
          url:
            "https://youtube-v31.p.rapidapi.com/search?q=" +
            search +
            "&regionCode=UK&maxResults=3&part=snippet%2Cid&order=relevance",
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "3c5d877b0bmshe9e8bab975e2cc3p1fb9a3jsnc36d958bc444",
            "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
          },
        };

        $.ajax(settings).done(function (response) {
          console.log(response);

          response.items.forEach((item) => {
            var itemTitle = $("<p>").text(item.snippet.title);
            var itemURL = $("<img>").attr(
              "src",
              item.snippet.thumbnails.medium.url
            );
            var itemVid = $("<a>").attr({href:"https://www.youtube.com/watch?v=" + item.id.videoId, target:"_blank", rel:"noopener noreferrer"});
            itemVid.attr({href:"https://www.youtube.com/watch?v=" + item.id.videoId, target:"_blank", rel:"noopener noreferrer"});
            itemVid.append(itemURL);
            var YTresponse = $("<div>");
            YTresponse.append(itemTitle, itemVid);
            $("#modal-body").append(YTresponse);
          });
        });
      });
    });
  });
}

// modal close onclick
document.addEventListener("click", function (event) {
  if (event.target.id === "modal-background") {
    $("#modal-background").addClass("hidden");
  }
});

$("#modalX").on("click", function (event) {
  $("#modal-background").addClass("hidden");
});



// ---------------------------------------AARON OLD SCHEDULE SECTION JAVASCRIPT--------------------
// empty schedule section, construct url and call ajax
// function scheduleRound() {
//     $('#schedule').empty();
//     $('#schedule').attr('class','show');
//     // set the api url
//     var league = 'id=' + leagues[$('#leagues').val()];
//     var year = '&s=' + $('#season').val();
//     var week = '&r=' + $('#gameweek').val();
//     var queryUrl = scheduleUrl + league + week + year;

//     $.ajax({"url": queryUrl,
// 		"method": "GET"
// 	})
// 	.then(function (response) {
//         // console.log(response);
// 		var fixtureTitle = $('<div>').attr('class','fixtureTitle');
//         var yearH = $('<h1>').text('Season: ' + $('#season').val() );
// 		var roundH = $('<h2>').text('Gameweek: ' + $('#gameweek').val());
//         fixtureTitle.append(yearH, roundH);
// 		$('#schedule').append(fixtureTitle);

//         // dynamic update of the fixtures
// 		scheduleDynamic(response);
//     });
//     return;
// }

// dynamically populate the html in the schedule section and add api data
// function scheduleDynamic(response) {
//     //loop through each fixture
//     for (var i = 0; i < response.events.length; i++) {
//         // create one heading for the details or date, time and venue for the match
//         var scheduleDiv = $('<div>').attr('class','scheduleDiv');
//         var buttonA = $('<a>').attr('class', 'youTubeBtn');
//         var YTlogo = $('<img>').attr('src', "./assets/images/YT.PNG");
//         buttonA.append(YTlogo);
//         var rawDate = moment(response.events[i].dateEvent,"YYYY-mm-dd").format('Do MMM YYYY');
//         var rawTime = moment(response.events[i].strTime,"HH:mm:ss").format('ha');
//         var venue = response.events[i].strVenue;
//         var logDiv = $('<div>').attr('class','fixtureLogistics');
//         var logHeading = $('<h6>').text(rawDate + ' - ' + rawTime)
//         var logVenue = $('<h5>').text(venue)
//         logDiv.append(logHeading, logVenue)
//             scheduleDiv.append(buttonA);
//             $('#schedule').append(scheduleDiv);

//         //get the fixtures and game detail
//         if (response.events[i].intHomeScore != null) {
//             var tableRow = $('<tr>').attr('class','fixtureTeam');
//             scheduleDiv.append(logDiv, tableRow);
//             var teamH = $('<td>').text(response.events[i].strHomeTeam);
//             // middle section of scores and colon
//             var scoreMiddle = $('<td>').attr('class','scoreMiddle');
//             var scoreH = $('<h3>').text(response.events[i].intHomeScore);
//             var colon = $('<h2>').text(" : ");
//             var scoreA = $('<h3>').text(response.events[i].intAwayScore);
//             scoreMiddle.append(scoreH, colon, scoreA);
//             var teamA = $('<td>').text(response.events[i].strAwayTeam);
//             tableRow.append(teamH, scoreMiddle, teamA);
//         } else {
//             var tableRow = $('<tr>').attr('class','fixtureTeam')
//             scheduleDiv.append(logDiv, tableRow);
//             var teamH = $('<td>').text(response.events[i].strHomeTeam);
//             // middle section of just v
//             var scoreMiddle = $('<td>').attr('class','scoreMiddle');
//             var vs = $('<h3>').text(" v ");
//             scoreMiddle.append(scoreH, vs, scoreA);
//             var teamA = $('<td>').text(response.events[i].strAwayTeam);
//             tableRow.append(teamH, scoreMiddle, teamA);

//         }
//         //TODO: add youtube button here with link to modal
//     }
// }
// --------------------------------------- END OF AARON OLD SCHEDULE SECTION JAVASCRIPT--------------------

///////////////////////////
// Player Search section
///////////////////////////
// function to get player details and populate to screen
function playerSearch(event) {
  var queryUrl;
  if ($("#playerSearchInput").val() == "") {
    var playerInput = "p=" + encodeURIComponent(event.target.innerText);
    // console.log(playerInput);
    queryUrl = playerUrl + playerInput;
  } else {
    var playerInput = "p=" + encodeURIComponent($("#playerSearchInput").val());
    queryUrl = playerUrl + playerInput;
    // console.log(playerInput);
  }

  $("#playerSearch").empty();

  // TODO: validate empty inputs
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    if (response.player[0].strSport == "Soccer") {
      // console.log(response);
      var article = $("<article>").attr("id", "playerResultsItem");
      $("#playerSearch").append(article);
      $("<h3>").text(" Search Results ").appendTo(article);

      //populate api data to HTML elements
      playerHtml(response);
    } else {
      var article = $("<article>").attr("id", "playerResultsItem");
      $("#playerSearch").append(article);
      $("<h3>").text(" Search Results ").appendTo(article);
      $("<h4>")
        .text('"' + $("#playerSearchInput").val() + '" does not exist ')
        .appendTo(article);
    }
  });
  $("#playerSearchInput").val("");
}

// function to populate api data to HTML elements
function playerHtml(response) {
  var divImg = $("<div>")
    .attr({ id: "playerImg", class: "playerImg" })
    .appendTo($("#playerResultsItem"));
  var img = $("<img>");
  img
    .attr({ src: response.player[0].strThumb, width: "250px" })
    .appendTo(divImg);

  var divBio = $("<div>")
    .attr({ id: "playerBio", class: "playerBio" })
    .appendTo($("#playerResultsItem"));

  var name = $("<h3>").text("Name: " + response.player[0].strPlayer);
  var bornDate = $("<h3>").text("DOB: " + response.player[0].dateBorn);
  var bornLocation = $("<h3>").text(
    "Born: " + response.player[0].strBirthLocation
  );
  var nationality = $("<h3>").text(
    "Nationality: " + response.player[0].strNationality
  );
  var position = $("<h3>").text("Position: " + response.player[0].strPosition);
  var team = $("<h3>").text("Team: " + response.player[0].strTeam);
  divBio.append(name, bornDate, bornLocation, nationality, position, team);

  var divInfo = $("<div>")
    .attr({ id: "playerInfo", class: "playerInfo" })
    .appendTo($("#playerResultsItem"));

  storePlayers(response.player[0].strPlayer);

  var title = $("<h3>").text("Profile:");
  var desc = $("<h3>").text(response.player[0].strDescriptionEN);
  divInfo.append(title, desc);
}

// Player Search History
//function to store city searched into localStorage
function storePlayers(player) {
  var playerList = { list: [] };
  if (localStorage.getItem("playerList") == undefined) {
    playerList.list.push(player);
    localStorage.setItem("playerList", JSON.stringify(playerList));
    getPlayerList();
    return;
  }

  playerList = JSON.parse(localStorage.getItem("playerList"));
  if (!playerList.list.includes(player)) {
    playerList.list.push(player);
    localStorage.setItem("playerList", JSON.stringify(playerList));
    getPlayerList();
    return;
  }
  getPlayerList();
  return;
}

//function to read city from localStorage
function getPlayerList() {
  var playerList;
  if (localStorage.getItem("playerList") != undefined) {
    playerList = JSON.parse(localStorage.getItem("playerList"));
    playerBtns(playerList);
    // console.log(playerList);
    return;
  }
  return;
}

//function to create city buttons
function playerBtns(playerList) {
  $("#borderPlayerSearch").empty();
  // aside for the recent search area
  var asideHistory = $("<aside>").attr({
    class: "borderPlayerSearch",
    id: "borderPlayerSearch",
  });
  $("#playerSearch").append(asideHistory);
  // Heading
  var headingDiv = $("<div>").attr({
    id: "recentSearch",
    class: "recentSearch",
  });
  asideHistory.append(headingDiv);
  var headingH3 = $("<h3>").text("Recent Searches");
  headingDiv.append(headingH3);
  // Button area
  var playerListDiv = $("<div>").attr({
    id: "recentSearchItems",
    class: "recentSearchItems",
  });
  asideHistory.append(playerListDiv);
  for (var i = 0; i < playerList.list.length; i++) {
    var playerDiv = $("<div>").attr({ id: "recentSearchItem" + i });
    playerListDiv.append(playerDiv);
    var playerBtn = $("<button>");
    playerBtn.attr({
      type: "button",
      "aria-label": playerList.list[i],
      class: "btn btn-light recentSearchPlayers",
      id: "recentSearchPlayers_" + i,
    });
    var playerBtnH4 = $("<h4>").text(playerList.list[i]);
    playerBtn.append(playerBtnH4);
    playerDiv.append(playerBtn);
  }
  // clear history button
  var removeListDiv = $("<div>").attr({
    id: "clearSearch",
    class: "clearSearch",
  });
  asideHistory.append(removeListDiv);
  var remove = $("<button>");
  remove.attr({
    type: "button",
    "aria-label": "clear history button",
    class: "btn btn-alert",
    id: "clearSearchHistory",
  });
  var clearBtnH4 = $("<h4>").text("Clear Recent Searches");
  remove.append(clearBtnH4);
  removeListDiv.append(remove);

  // on button clicks
  $(".recentSearchPlayers").unbind("click").on("click", playerSearch);
  $("#clearSearchHistory").unbind("click").on("click", clearHistory);
  return;
}

//
function clearHistory() {
  $("#borderPlayerSearch").empty();
  localStorage.clear("playerList");
}
