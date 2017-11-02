const canvas = document.getElementById('art');
paper.setup(canvas);

const Rectangle = paper.Rectangle;
const Path = paper.Path;
const Point = paper.Point;
const Group = paper.Group;

const DIVIDER_LINE_WIDTH = 20;
const MAX_LEVEL = 5;

console.log(paper.view.bounds);
console.log("modern");

var mainGroup = new Group();
var tempGroup;
/* draws the rectangles for the art within the viewport bounds
 * Also, a good pun in my opinion
 *
 */
var pietMondrawIt = function(callback = function(){}) {
  // create a group to hold all of the rects
  mainGroup.removeChildren();
  let bounds = paper.view.bounds;
  divideRect(bounds);
  paper.view.draw();
  callback();
}

/*
 * Selects a few random uncolored rectangles and colors them using from the
 * given color palette
 * Params:
 *  ~ colors - [String[]] of hex values which used for coloring the rectangles
 *      - defaults to [yellow (#ffe04d), red (#ff1a1a), blue (#1a1aff)]
 */
var colorIt = function(colors=["#ffe04d", "#ff1a1a", "#1a1aff"]) {
  console.log(colors);
  // confirm that there are rectangles
  if (mainGroup.children === undefined) {
    throw "No rectangles to color";
  } else if (mainGroup.children.length < 1) {
    throw "No rectangles to color"
  }
  // duplicate both arrays
  var kids = mainGroup.children.slice();

  // randomly color up to minimum left uncolored defined below
  var chanceMultiplier = Math.randRange(5, 6) / 10,
      minUncolored = Math.floor(mainGroup.children.length * chanceMultiplier);

  while (kids.length >= minUncolored) {
    let rect = kids.pick();
    kids.splice(kids.indexOf(rect), 1);
    console.log(kids);
    console.log("BEFORE", colors);
    let clr = colors.shift();
    colors.push(clr);
    console.log("AFTER", colors);
    rect.fillColor = clr;
  }
  stopLoad();
}

/*
 * Random recursive divider of rectangles
 * Params:
 *  ~ bounds - [Rectangle] used to deal with bounds of the physical rectangle
 *  ~ level - [int] telling the number of times the rect has been split
 */
var divideRect = function(bounds, level = 0) {
  console.log("Level:", level);
  console.log("Point: (" + bounds.x + ", " + bounds.y + ") ");
  console.log("(W, H): (" + bounds.width + ", " + bounds.height + ") ");
  console.log("-------------------------------------------------")

  var divide = Math.floor(Math.random() * Math.pow(2, level)) <= 2;
  if (level >= MAX_LEVEL || !divide) {
    // add the rectangle to the group
    drawRect(bounds);
    //stop recursing
    return;
  }
  // decide whether to split
  var isHoriz = level % 2 == 0;
  // var isHoriz = Math.floor(Math.random() * 2) == 0;
  // divert the split job to these guys (vert or horiz)
  if (isHoriz) {
    splitHoriz(bounds, level);
  } else {
    splitVert(bounds, level);
  }
}

/* Splits a rectangle in half with a horizontal line, then calls divideRect on
 * the two component rectangles. E.g. : [ ] -> [-]
 *
 * Params:
 *  ~ bounds - [Rectangle] used to deal with bounds of the physical rectangle
 *  ~ level - [int] telling the number of times the rect has been split
 */
var splitHoriz = function(bounds, level) {
  // get the relative height at which to split
  let topH = Math.randRange(bounds.height * .3 , bounds.height * .7);
  let newY = topH + bounds.y;
  let bottomH = bounds.height - topH;
  // create the top bounding rect,
  let tRect = new Rectangle(new Point(bounds.x, bounds.y), bounds.width, topH);
  // create the bottom bounding rect
  let bRect = new Rectangle(new Point(bounds.x, newY), bounds.width, bottomH);

  // divide the top rect
  divideRect(tRect, level + 1);
  // divide the bottom rect
  divideRect(bRect, level + 1);
}

var splitVert = function(bounds, level) {
  // get the relative width at which to split
  let lW = Math.randRange(bounds.width * .2 , bounds.width * .8);
  let newX = lW + bounds.x;
  let rW = bounds.width - lW;
  // create the top bounding rect,
  let lRect = new Rectangle(new Point(bounds.x, bounds.y), lW, bounds.height);
  // create the bottom bounding rect
  let rRect = new Rectangle(new Point(newX, bounds.y), rW, bounds.height);

  // divide the top rect
  divideRect(lRect, level + 1);
  // divide the bottom rect
  divideRect(rRect, level + 1);
}

var drawRect = function(rect) {
  // draw a rectangle at the given position
  console.log("DRAWING");
  var path = new Path.Rectangle(rect);
  path.strokeWidth = DIVIDER_LINE_WIDTH;
  path.strokeColor = '#000000';
  path.fillColor = '#ffffff';
  mainGroup.addChild(path);
}

var modernize = function(colors) {
  pietMondrawIt(function() {
    colorIt(colors);
  });
}
