currentWord = "";
currentImg = "";

var startLoad = function() {
  $(".load-wrap").css("display", "block");
}

var stopLoad = function() {
  $(".load-wrap").css("display", "none");
}

var toggleDetails = function() {
  let up = $("aside").outerHeight();
  let newM = "0px";
  if ($(".art-frame").css("margin-top") == "0px") {
    newM = -up + "px";
    $("#details").addClass("active");
  } else {
    $("#details").removeClass("active");
    $("#generate").addClass("active");
  }
  $(".art-frame").css("margin-top", newM);
}

var toggleAbout = function() {
  let up = $("#about").outerHeight();
  let newM = "0px";
  if ($("#about").css("margin-top") == "0px") {
    newM = -up + "px";
    $("#about-link").removeClass("active");
    $("#generate").addClass("active");
  } else {
    $("#about-link").addClass("active");
  }
  $("#about").css("margin-top", newM);
}

$("#generate").on("click", function() {
  $("a.active").removeClass("active");
  let up = $("#about").outerHeight();
  $("#about").css("margin-top", -up + "px");
  $(".art-frame").css("margin-top", "0px");
  $("#generate").addClass("active");
  generate();
})

$("#details").on("click", function() {
  $("a.active").removeClass("active");
  $("#about").css("margin-top", (-$("#about").outerHeight()) + "px");
  toggleDetails();
})
$("#about-link").on("click", function() {
  $("a.active").removeClass("active");
  $(".art-frame").css("margin-top", "0px");
  toggleAbout();
})

var update = function() {
  $("#seed-word").html(currentWord.toTitleCase());
  $("#original").attr("src", currentImg);
  console.log(currentImg);
  colorThief = new ColorThief();
  let o = {
    colors: 1
  }
  colorThief.getPaletteFromUrl(currentImg, function(cPal) {
    let hexVals = cPal.map(function(rgbVal) {
      return rgbToHex(rgbVal[0], rgbVal[1], rgbVal[2]);
    });
    modernize(hexVals);
  }, {
    colors:4, quality:10
  });
}

var getSeedWord = function(callback=function(){}) {
  minCorpusCount = 100000
  try {
    $.ajax({
      url: "http://api.wordnik.com/v4/words.json/randomWords?"
      + "hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount="
      + minCorpusCount + "&maxCorpusCount=-1"
      + "&minDictionaryCount=1&maxDictionaryCount=-1"
      + "&minLength=5&maxLength=-1&limit=100&api_key=" + WordnikAPIKey,
      success: function(data) {
        nouns = eval(data);
  			var seedWord = nouns.pick().word;
        currentWord = seedWord;
        return callback(seedWord);
      },
      error : function(err) {
        console.log("Error pulling from Wordnik");
        currentWord = "Error";
        return callback(currentWord);
      },
      async: true,
      dataType:"json"
    });
  } catch (e) {
    console.log("Error pulling from DB");
    currentWord = "Error";
    return callback(currentWord);
  }
}

var getPhotoFromFlickr = function(seedWord) {
  $.ajax({
    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&text='
    + seedWord
    + '&media=photos'
    + '&safe_search=3'
    + '&format=json&nojsoncallback=1&api_key=' + FlickrAPIKey,
    success: function(data) {
      console.log("	got images");
      // gets image (see https://www.flickr.com/services/api/misc.urls.html)
      var photo = data.photos.photo.pick();
      currentImg = "image.php?p="
        + "https://farm" + photo.farm + ".staticflickr.com/"
        + photo.server + "/" + photo.id + "_" + photo.secret + "_d.jpg";
      update();
    },
    async: true,
    dataType:"json"
  });
}

function generate() {
  startLoad();
  getSeedWord(getPhotoFromFlickr);
}
