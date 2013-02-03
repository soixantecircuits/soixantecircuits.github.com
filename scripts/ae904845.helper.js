var remove_style = function(all) {
  var i = all.length;
  var j, is_hidden;

  // Presentational attributes.
  var attr = ['align', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'color', 'face', 'height', 'hspace', 'marginheight', 'marginwidth', 'noshade', 'nowrap', 'valign', 'vspace', 'width', 'vlink', 'alink', 'text', 'link', 'frame', 'frameborder', 'clear', 'scrolling', 'style'];

  var attr_len = attr.length;

  while(i--) {
    is_hidden = (all[i].style.display === 'none');

    j = attr_len;

    while(j--) {
      all[i].removeAttribute(attr[j]);
    }

    // Re-hide display:none elements,
    // so they can be toggled via JS.
    if(is_hidden) {
      all[i].style.display = 'none';
      is_hidden = false;
    }
  }
};

var randomFromInterval = function(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  };

var shuffle = function(o) { //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

var findMaxZIndex = function() {
    var index_highest = 0;
    $("#image").children().each(function(key, val) {
      var index_current = parseInt($(this).css("zIndex"), 10);
      if(index_current > index_highest) {
        index_highest = index_current;
      }
    });
    return index_highest;
  };

Array.max = function(array) {
  return Math.max.apply(Math, array);
};
Array.min = function(array) {
  return Math.min.apply(Math, array);
};

var findLowerImageBorder = function() {
    var arrayPosition = [];
    $(".canvasdraw").each(function(index, el) {
      arrayPosition.push($(el).offset().top + $(el).height());
    });
    return Array.max(arrayPosition)
}
