var search = "2023-01-14 Brighton 3 : 0 Liverpool"

const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://youtube-v31.p.rapidapi.com/search?q=" + search + "&regionCode=UK&maxResults=5&part=snippet%2Cid&order=relevance",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "3c5d877b0bmshe9e8bab975e2cc3p1fb9a3jsnc36d958bc444",
		"X-RapidAPI-Host": "youtube-v31.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
	
	var link = $('<a>').attr('href','https://www.youtube.com/watch?v=' + response.items[0].id.videoId);
	$('body').append(link);
	var image = $('<img>').attr({'src':'https://icon-library.com/images/16x16-youtube-icon/16x16-youtube-icon-11.jpg',
		'width':'100px',
		});
	link.append(image);

	var thumbnail = $('<img>');
	thumbnail.attr('src',response.items[0].snippet.thumbnails.medium.url);
	$('body').append(thumbnail);
});