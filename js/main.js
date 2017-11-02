currentWord = "";
currentImg = "";

var startLoad = function() {
  $(".load-wrap").css("display", "block");
}

var stopLoad = function() {
  $(".load-wrap").css("display", "none");
}

$("#about").on("click", function() {
  $(".details-bar").click();
})

$(".details-bar").on("click", function() {
  console.log("adsg");
  let up = $("aside").outerHeight();
  console.log(-up);
  let newM = ($(".art-frame").css("margin-top") == "0px") ? -up+"px" : "0px";
  console.log(newM);
  $(".art-frame").css("margin-top", newM);
})

$(document).on('picture_received', function() {
  $("aside h2").html(currentWord.toTitleCase());
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
});

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
      $(document).trigger('picture_received')
    },
    async: true,
    dataType:"json"
  });
}

function generate() {
  startLoad();
  getSeedWord(getPhotoFromFlickr);
}
