randomFromInterval = function(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}
shuffle = function(o) { //v1.0
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

findLowerImageBorder = function(){
  var arrayPosition = [];
  $(".canvasdraw").each(function(index,el){
    arrayPosition.push($(el).position().top + $(el).height());
  });
  return Array.max(arrayPosition)
}

var imagePrepend = "soixantecircuits_60circuits_interaction_developpement",
  imageExtension = ".jpg",
  imagePath = "images/",
  imgNum = 0,
  maxNum = 9,
  imageArray = [];
for(var imgNum = 0; imgNum < maxNum; imgNum++) {
  imageArray.push({
    "file": imagePrepend + 0 + imgNum + imageExtension
  });
}

$(function() {
  shuffle(imageArray);
  var target = "#image",
    alt = "Soixante circuits",
    imgId = "img",
    steps = 0;
  $.each(imageArray, function(index, el) {
    var img = $('<img />').attr({
      'id': imgId + index,
      'src': imagePath + el.file,
      'alt': alt
    });
    img.addClass("hide");
    var container = $('<div />').attr({
      "class": "canvasdraw"
    }),
      cell = $('<div />').attr({
        "class": "cell"
      });
    cell.append(img);
    container.append(cell);
    img.one('load', function() {
      container.fadeIn("2000").addClass("imageAction").css({
        'top': steps + randomFromInterval(-100, -10) + "px",
        'left': randomFromInterval(40, 60) + "%",
        'width': randomFromInterval(20, 40) + "%",
        'zIndex': randomFromInterval(2, 100)
      }).appendTo($(target));
      img.removeClass("hide");
      steps = findLowerImageBorder();
    }).each(function() {
      if(this.complete) $(this).load();
    });
  });
});