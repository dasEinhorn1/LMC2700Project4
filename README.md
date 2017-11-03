# LMC2700 Project 4
 This project is a modern art generator inspired by the work Piet Mondrian, an
 Early 20th Century artist who specialized in abstract art. One of his most
 famous works, "Composition in Red, Blue, and Yellow, 1930." is the basis for
 the design of this project. The piece features the three primary colors divided
 into nested rectangles separated by thick black lines. The simplicity of the
 image is what makes it so aesthetically pleasing.

 There is also something inherently procedural-- even recursive about the way
 the piece is composed. This project attempts to capitalize on and expand this
 procedurality by automatically generating Mondrian-esque representations of
 images pulled from the Flickr API.

 In order to complete this project, I used a number of APIs and libraries. They
 are all listed in the about section of the site, but the main three APIs used
 were Wordnik, Flickr, and Google Fonts. The others did not require any sort of
 asynchronous calls. Wordnik is used to pull in a random noun, which is fed to a
 Flickr image search to select a random image to Mondrian-ify. Google Fonts is
 less data focused and more about having a font which fits into the aesthetic of
 the site.

 In order to generate the actual artwork, I used Color Thief, which extracts
 color palettes from images, and Paper.js, a vector graphics scripting tool
 which works with the HTML5 canvas. Using these, I converted each randomly
 selected image into a palette of 3 to 4 colors. I then recursively subdivided
 the boundaries of the canvas to draw the rectangles. Each divide is governed by
 chance, and the chance goes down by a factor of 2 each time a rectangle is
 divided. The division points are also random, so each resulting layout is very
 unique. A random percentage of the rectangles is then colored using the colors
 from the given palette. This creates the final result.

 This project aims to ask questions about the nature of abstraction from a
 computational perspective. Can a computer create something abstract
 or original? In this case, the algorithm wears it's influences on its sleeve,
 but it is still interesting to think about how abstract art caters to
 computation. With relatively little data, this project is capable of making a
 passable remix of a famous work of art. There is something to be said for that.

 You can view the site at: http://homes.lmc.gatech.edu/~ahayward3/
