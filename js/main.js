currentWord = "";
currentImg = ""
Array.prototype.pick = function() {
  return this[Math.floor(Math.random() * this.length)];
}

String.prototype.toTitleCase = function () {
      return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

$(document).on('picture_updated', function() {
  $(".description>h3").html(currentWord.toTitleCase());
  console.log(currentImg);
  colorThief = new ColorThief();
  let o = {
    colors: 1
  }
  colorThief.getPaletteFromUrl(currentImg, function(colorPalette) {
      for (let rgbVal of colorPalette) {
      console.log(rgbVal);
    }
  }, {
    colors:4, quality:10
  });
});

var getSeedWord = function(callback=function(){}) {
  minCorpusCount = 100000
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
    async: true,
    dataType:"json"
  });
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
      $(document).trigger('picture_updated')
    },
    async: true,
    dataType:"json"
  });
}
