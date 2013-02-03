//basic object for point manipulation
var Point = function(x, y) {
    this.x = x;
    this.y = y;
  }

var give_me_a_point = function(element, radius, variation, numberOfPoint) {
    var el = $(element),
      width = el.width(),
      horizontalCenter = width / 2,
      height = el.height(),
      verticalCenter = height / 2,
      center = new Point(horizontalCenter, verticalCenter),
      pointArray = [];

    for(var nb_point = 0; nb_point < numberOfPoint; nb_point++) {
      var point = new Point();
      var TWO_PI = 2 * Math.PI;
      point.x = randomFromInterval(radius - variation, radius + variation) * Math.cos((TWO_PI / numberOfPoint) * nb_point);
      point.y = randomFromInterval(radius - variation, radius + variation) * Math.sin((TWO_PI / numberOfPoint) * nb_point);
      pointArray.push(point);
    }

    return pointArray;
};