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
    "show", "show", "hidden", "hidden",
    "show", "hidden", "hidden",
    "hidden", "show", "hidden", "hidden"
  );

  $("#updateBtnLeague").unbind("click").on("click", leagueTable);
}
// show or hide the relevant content for schedules
function showSchedulePage() {
  hideShow(
    "show",
    "show", "show", "show", "hidden",
    "hidden", "show", "hidden",
    "hidden", "hidden", "show", "hidden"
  );

  gameweekGenerate();
  $("#leagues").on("change", gameweekGenerate);
  $("#updateBtnSchedule").unbind("click").on("click", scheduleRound);
}
// show or hide the relevant content for player searchs
function showPlayerPage() {
  hideShow(
    "show",
    "hidden", "hidden", "hidden", "show",
    "hidden", "hidden", "show",
    "hidden", "hidden", "hidden", "show"
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
  $("#leagueTable").removeClass("show hidden").addClass(lt);
  $("#schedule").removeClass("show hidden").addClass(s);
  $("#playerSearch").removeClass("show hidden").addClass(ps);
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
  var pos = $("<th>").text("").attr("class", "position");
  var logo = $("<th>").text("").attr("class", "logo");
  var team = $("<th>").text("Team").attr("class", "team");
  var played = $("<th>").text("Pld").attr("class", "played");
  var wins = $("<th>").text("W").attr("class", "wins");
  var draws = $("<th>").text("D").attr("class", "draws");
  var loses = $("<th>").text("L").attr("class", "loses");
  var gd = $("<th>").text("GD").attr("class", "goalDiff");
  var gf = $("<th>").text("GF").attr("class", "gf");
  var ga = $("<th>").text("GA").attr("class", "ga");
  var points = $("<th>").text("Pts").attr("class", "points");
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
  var leagueTitle = $("<div>").attr("id", "leagueTitleInfo");
  leagueTitle.html(
    `<h1>League: ${response.table[0].strLeague}</h1> <h2>Season: ${response.table[0].strSeason}</h2>`
  );
  $("#leagueTable").prepend(leagueTitle);
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
    var team = $("<td>")
      .text(response.table[i].strTeam)
      .attr("class", "team");
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
    // remove Promotion from the premier league info column
    var desc = $("<td>")
    .attr("class", "info");
    if (response.table[i].strDescription.includes("Champions") ||
      response.table[i].strDescription.includes("Europa")) {
        var league_info = response.table[i].strDescription.replace("Promotion - ", "");
        desc.text(league_info);
    } else {
      desc.text(response.table[i].strDescription);
    }
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
// - Populate HTML table with Football API data 
// - create YouTube icons + onclicks with YoutTube API call based on Football data 
// - show and populate modal on YT click - modal close onclick for X and modal background as per expected behaviour   
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

// Function to call API for Schedule Section 
// Populate HTML as a table 
// Add YouTube icon with data attr for YouTube API call
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
    // console.log(response);
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
      var rawDate = moment(response.events[i].dateEvent, "YYYY-MM-DD").format("Do MMM YYYY");
      var rawTime = moment(response.events[i].strTime, "HH:mm:ss").format("ha");
      var venue = response.events[i].strVenue;
      var homeT = response.events[i].strHomeTeam;
      var scoreH = response.events[i].intHomeScore;
      var scoreA = response.events[i].intAwayScore;
      var awayT = response.events[i].strAwayTeam;
      var fixtureRow = $("<tr>");
      if (scoreH == null) {
        fixtureRow.html(` <td>${venue}<br/>${rawDate} @ ${rawTime} </td>
          <td>${homeT}</td>
          <td>vs</td>
          <td>${awayT}</td>
          <td><img class="yticon" src="../assets/images/YT.png" data-date="${rawDate}" data-homeT="${homeT}" data-scoreH="${scoreH}" data-scoreA="${scoreA}" data-awayT="${awayT}"></td>`);
      } else {
        fixtureRow.html(` <td>${venue}<br/>${rawDate} @ ${rawTime} </td>
          <td>${homeT}</td>
          <td>${scoreH} : ${scoreA}</td>
          <td>${awayT}</td>
          <td><img class="yticon" src="../assets/images/YT.png" data-date="${rawDate}" data-homeT="${homeT}" data-scoreH="${scoreH}" data-scoreA="${scoreA}" data-awayT="${awayT}"></td>`);
      }
      $("#fixtureTableBody").append(fixtureRow);
    }
    ytButtons();
  });
}

// function to create on click for each YouTube button
// Call YouTube API using data attributes set in Fixture table generation above

function ytButtons () {
  const ytButtonsCollection = $(".yticon");
    const ytButtonsArray = Array.from(ytButtonsCollection);

    ytButtonsArray.forEach((button) => {
      button.addEventListener("click", (e) => {

        $("#modal-body").html(`<h1> Finding Highlights... </h1>`)
        $("#modal-background").removeClass("hidden");
        const { date, homet, scoreh, awayt, scorea } = e.target.dataset;
        var search = `${date} ${homet} ${scoreh} : ${scorea} ${awayt}`;
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
        // Populate Modal with 3 search results from API
        $.ajax(settings).done(function (response) {
          // console.log(response);
          $("#modal-body").empty();
          response.items.forEach((item) => {
            var itemTitle = $("<p>").text(item.snippet.title);
            var itemURL = $("<img>").attr(
              "src",
              item.snippet.thumbnails.medium.url
            );
            var itemVid = $("<a>").attr({href:"https://www.youtube.com/watch?v=" + item.id.videoId, target:"_blank", rel:"noopener noreferrer"});
            itemVid.attr({href:"https://www.youtube.com/watch?v=" + item.id.videoId, target:"_blank", rel:"noopener noreferrer"});
            itemVid.append(itemURL);
            var YTresponse = $("<div>").addClass("responseDiv");
            YTresponse.append(itemTitle, itemVid);
            $("#modal-body").append(YTresponse);
          });
        });
      });
    });
}

// Modal close onclicks
document.addEventListener("click", function (event) {
  if (event.target.id === "modal-background") {
    $("#modal-background").addClass("hidden");
  }
});

$("#modalX").on("click", function (event) {
  $("#modal-background").addClass("hidden");
});

///////////////////////////
// Player Search section
///////////////////////////
// function to get player details and populate to screen
function playerSearch(event) {
  var queryUrl;
  var player;
  if ($("#playerSearchInput").val() == "" && event.target.id.includes("recentSearchPlayers_")) {
      player = event.target.innerText;
      var playerInput = "p=" + encodeURIComponent(player);
      queryUrl = playerUrl + playerInput;
  } else if ($("#playerSearchInput").val() == "" && event.target.id == "searchBtnPlayer") {
      makeModal("The search Input was empty, please try again");
      $("#closeModal").unbind('click').on("click", function (event) {
        $("#myModal").remove();
      });
      return;
  } else {
    player = $("#playerSearchInput").val();
    var playerInput = "p=" + encodeURIComponent(player);
    queryUrl = playerUrl + playerInput;
  }

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    if (response.player == null) {
      makeModal('"' + player + '" does not exist ');
      $("#closeModal").unbind('click').on("click", function (event) {
        $("#myModal").remove();
      });
      return;
    } else if (response.player[0].strSport == "Soccer") {
      $("#playerResultsItem").empty();
      $("<h3>").text(" Search Results ").appendTo($("#playerResultsItem"));
      //populate api data to HTML elements
      playerHtml(response);
    } else {
      makeModal('"' + $("#playerSearchInput").val() + '" does not exist ');
      $("#closeModal").unbind('click').on("click", function (event) {
        $("#myModal").remove();
      });
      return;
    }
  });
  $("#playerSearchInput").val("");
  return;
}

// make a modal with customer text to call out errors
function makeModal(msg) {
  var modalDiv = $("<div>").attr({"id":"myModal","class":"modal-background"});
  $("#playerSearch").append(modalDiv);
  var modalContent = $("<div>").attr("class","modal-window");
  modalDiv.append(modalContent);
  var close = $("<div>").attr({"id":"closeModal","class":"close"});
  var closeBtn = $("<span>").text("X");
  close.append(closeBtn);
  var p = $("<p>").attr("class","modalPara").text(msg);
  modalContent.append(close, p);
  $("#closeModal").unbind('click').on("click", function (event) {
    $("#myModal").remove();
  });
}


// function to populate api data to HTML elements
function playerHtml(response) {
  storePlayers(response.player[0].strPlayer);
  $("#playerSearchTitle").empty();
    $("#playerSearchTitle").html(
      `<h1>Player Search</h1> <h2>${response.player[0].strPlayer}</h2>`
    );
  var playerInfo = response.player[0].strDescriptionEN.split('.');
    $("#playerResultsItem").html(`<div class="playerGrid">
    <div id="playerImg">
      <img class ="imgPlaceHolder" src="${response.player[0].strThumb}" alt="Image of ${response.player[0].strPlayer}"/>
    </div>
    <div id="playerBio" >
      <div>
      <h4>Born</h4> 
      <p>${response.player[0].strBirthLocation}</p>
      <h4>Nationality</h4> 
      <p>${response.player[0].strNationality}</p>
      <h4>DOB</h4>
      <p>${response.player[0].dateBorn}</p>
      </div>
      <div>
      <h4>Team</h4>
      <p>${response.player[0].strTeam}</p>
      <h4>Position</h4>
      <p> ${response.player[0].strPosition}</p>
      </div>
    </div>`);
 var playerInfoDiv = $("<div>").attr("id", "playerInfo")
 $("#playerResultsItem").append(playerInfoDiv)
 if (response.player[0].strDescriptionEN != null) {
  var playerInfo = response.player[0].strDescriptionEN.split('.');
  for (let index = 0; index < 3; index++) {
    var scentence = $("<p>").text(playerInfo[index]);
    playerInfoDiv.append(scentence);
  }
 } else {
  var scentence = $("<p>").text("No Bio available");
  playerInfoDiv.append(scentence);
 }
}


// Player Search History
//function to store player searched into localStorage
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

//function to read player from localStorage
function getPlayerList() {
  var playerList;
  if (localStorage.getItem("playerList") != undefined) {
    playerList = JSON.parse(localStorage.getItem("playerList"));
    playerBtns(playerList);
    return;
  }
  return;
}

//function to create player searched buttons
function playerBtns(playerList) {
  $("#borderPlayerSearch").empty();
  // aside for the recent search area
  var asideHistory = $("#borderPlayerSearch");
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
    })
      .text(playerList.list[i]);
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
  })
  .text("CLEAR");
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
