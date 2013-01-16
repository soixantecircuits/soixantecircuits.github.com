/*
 * Basic pub sub jQuery
 */
;
var topics = {};

jQuery.Topic = function(id) {
  var callbacks, topic = id && topics[id];
  if(!topic) {
    callbacks = jQuery.Callbacks();
    topic = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove
    };
    if(id) {
      topics[id] = topic;
    }
  }
  return topic;
};


/*
 * getStyleObject Plugin for jQuery JavaScript Library
 * From: http://upshots.org/?p=112
 *
 * Copyright: Unknown, see source link
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */

;
(function($) {
  $.fn.getStyleObject = function() {
    var dom = this.get(0);
    var style;
    var returns = {};
    if(window.getComputedStyle) {
      var camelize = function(a, b) {
          return b.toUpperCase();
        }
      style = window.getComputedStyle(dom, null);
      for(var i = 0; i < style.length; i++) {
        var prop = style[i];
        var camel = prop.replace(/\-([a-z])/g, camelize);
        var val = style.getPropertyValue(prop);
        returns[camel] = val;
      }
      return returns;
    }
    if(dom.currentStyle) {
      style = dom.currentStyle;
      for(var prop in style) {
        returns[prop] = style[prop];
      }
      return returns;
    }
    return this.css();
  }
})(jQuery);

/****************/
/*app start here*/

var vimeo_players = [];

prepareplayer = function() {
  $("iframe").each(function(index, el) {
    var iframe = $(el)[0],
      player = $f(iframe);

    vimeo_players.push(player);
    // When the player is ready, add listeners for pause, finish, and playProgress
    player.addEvent('ready', function() {
      $.Topic("vimeoLoaded").publish(player);
      player.addEvent('play', onPlay);
      player.addEvent('pause', onPause);
      player.addEvent('finish', onFinish);
    });
  });
}

function onPlay(id) {
  //$("#"+id).parent().find(".mask").show();
}


function onPause(id) {
  $("#" + id).parent().find(".mask").show();
}

function onFinish(id) {
  $("#" + id).parent().find(".mask").show();
}

function onPlayProgress(data, id) {
  //status.text(data.seconds + 's played');
}

getVimeoVideos = function(user) {
  $.ajax({
    url: 'http://vimeo.com/api/v2/' + user + '/videos.json',
    dataType: 'jsonp',
    type: 'get'
  }).done(function(data) {
    var items = [];
    $.each(data, function(key, val) {
      items.push({
        "file": val.id.toString(),
        "type": "vimeo"
      });
    });
    $.Topic("videoDownloaded").publish(items);
  });
}

randomFromInterval = function(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}
shuffle = function(o) { //v1.0
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

findMaxZIndex = function() {
  var index_highest = 0;
  $("#image").children().each(function(key, val) {
    var index_current = parseInt($(this).css("zIndex"), 10);
    if(index_current > index_highest) {
      index_highest = index_current;
    }
  });
  return index_highest;
}

Array.max = function(array) {
  return Math.max.apply(Math, array);
};
Array.min = function(array) {
  return Math.min.apply(Math, array);
};

findLowerImageBorder = function() {
  var arrayPosition = [];
  $(".canvasdraw").each(function(index, el) {
    arrayPosition.push($(el).offset().top + $(el).height());
  });
  return Array.max(arrayPosition)
}

slice = function(el) {

  var originalHtml = el.html(),
    originalHeight = el.height(),
    css = el.getStyleObject(),
    innerTop = $('<div />', {
      html: originalHtml
    }).css(css).css({
      margin: "0px"
    }),
    top = $('<div />', {
      class: "slice sliceTop",
      html: innerTop,
    }).css({
      height: originalHeight / 2,
    }),
    innerBottom = $('<div />', {
      html: originalHtml
    }).css(css).css({
      position: "absolute",
      top: -originalHeight / 2,
      margin: "0px"
    }),
    bottom = $('<div />', {
      class: "slice sliceBottom",
      html: innerBottom
    }).css({
      height: originalHeight / 2
    }),
    wrapper = $('<div />', {
      class: "sliced-content"
    }).css({
      height: originalHeight,
      margin: el.css("margin"),
      padding: el.css("padding")
    });
  wrapper.append(top).append(bottom);
  el.before(wrapper).hide();
}

animate = function(top, bottom) {
  TweenLite.set(top.parent(), {
    css: {
      perspective: 500
    }
  });
  TweenLite.to(top, 1, {
    css: {
      translateZ: -10,
      backgroundColor: "#444",
      rotationX: -90,
      transformOrigin: "bottom left"
    }
  });
  TweenLite.to(bottom, 1, {
    css: {
      translateZ: -10,
      backgroundColor: "#444",
      rotationX: 90,
      transformOrigin: "top left"
    }
  });
  //TweenLite.to(top.parent(), 1, {css:{height:0}});
}
animateInverse = function(top, bottom) {
  TweenLite.to(top, 1, {
    css: {
      backgroundColor: "transparent",
      rotationX: 0,
      transformOrigin: "bottom left"
    }
  });
  TweenLite.to(bottom, 1, {
    css: {
      backgroundColor: "transparent",
      rotationX: 0,
      transformOrigin: "top left"
    }
  });
  //TweenLite.to(top.parent(), 1, {css:{height:150}});
}

var imagePrepend = "soixantecircuits_60circuits_interaction_developpement",
  imageExtension = ".jpg",
  imagePath = "images/",
  imgNum = 0,
  maxNum = 9,
  imageArray = [];
for(var imgNum = 0; imgNum < maxNum; imgNum++) {
  imageArray.push({
    "file": imagePrepend + 0 + imgNum + imageExtension,
    "type": "image"
  });
}

getVimeoVideos("soixantecircuits");


var prepareVideo = function(video) {
    var content = $.merge(imageArray, video);
    shuffle(content);
    $.Topic("videoReady").publish(content);
  }

var setupImageAndVideo = function(content) {
    var target = "#image",
      alt = "Soixante circuits",
      imgId = "img",
      steps = 0,
      delay = 0.5;
      vimeoClass = "";

    $.each(content, function(index, el) {
      if(el.type == "image") {
        var displayElement = $('<img />').attr({
          'id': imgId + index,
          'class': "draggable",
          'src': imagePath + el.file,
          'alt': alt
        });
      } else {
        var displayElement = $('<iframe />').attr({
          'id': el.file,
          'class': "no-events",
          'src': "http://player.vimeo.com/video/" + el.file + "?api=1&player_id=" + el.file,
          'width': "100%",
          'height': "auto",
          "frameborder": 0,
          'webkitAllowFullScreen': "",
          'mozallowfullscreen': "",
          'allowFullScreen': ""
        });
        vimeoClass = "vimeo";
      }

      var container = $('<div />').attr({
        "class": "canvasdraw",
        "id": el.type + "_" + el.file.replace(".", "_")
      }),
        cell = $('<div />').attr({
          "class": "cell " + vimeoClass
        });
      cell.append(displayElement);
      if(el.type == "vimeo") {
        var dragger = $('<div />').attr({
          class: "mask"
        });
        //dragger.html('<i class="icon-play"></i>');
        cell.append(dragger);
      }
      container.addClass("hide");

      container.append(cell);

      container.css({
        'top': steps + randomFromInterval(30, 10) + "px",
        'left': randomFromInterval(-20, 10) + "px",
        'width': randomFromInterval(20, 40) + "%",
        'zIndex': randomFromInterval(2, 100)
      }).appendTo($(target));

      TweenLite.to(container, 0, {
        css: {
          opacity: 0,
        }
      });

      displayElement.one('load', function() {
        container.removeClass("hide").addClass("imageAction");
        TweenLite.to(container, 1, {
          css: {
          opacity: 1,
        },
          delay: delay
        });
        delay += 0.1;

        steps = findLowerImageBorder();
        //console.log(steps);
        //steps = 0;
      }).each(function() {
        if(this.complete) $(this).load();
      });
    });
    prepareplayer();
    $('.canvasdraw').click(function() {
      $(this).css("zIndex", findMaxZIndex() + 1);
    })
    if($(".mask").length > 0) {
      $('.mask').click(function() {
        var playerFrame = $(this).parent().find('iframe');
        if(playerFrame.length > 0) {
          var iframe = $(playerFrame)[0],
            player = $f(iframe);
          player.api('play');
          $(this).hide();
        }
      });
    }

    //$('.canvasdraw').pep();
    $('.canvasdraw').draggable({
      start: function(e, ui) {
        $(this).css("zIndex", findMaxZIndex() + 1);
        dragMomentum.start(this.id, e.clientX, e.clientY, e.timeStamp);
      },
      stop: function(e, ui) {
        dragMomentum.end(this.id, e.clientX, e.clientY, e.timeStamp);
      },
      cursor: "move",
      delay: 100
    });
  }

var dragMomentum = new function() {
    var howMuch = 30; // change this for greater or lesser momentum
    var minDrift = 6; // minimum drift after a drag move
    var easeType = 'easeOutBack';

    //  This easing type requires the plugin:  
    //  jquery.easing.1.3.js  http://gsgd.co.uk/sandbox/jquery/easing/
    var dXa = [0];
    var dYa = [0];
    var dTa = [0];

    this.start = function(elemId, Xa, Ya, Ta) {
      dXa[elemId] = Xa;
      dYa[elemId] = Ya;
      dTa[elemId] = Ta;
    }; // END dragmomentum.start()
    this.end = function(elemId, Xb, Yb, Tb) {
      var Xa = dXa[elemId];
      var Ya = dYa[elemId];
      var Ta = dTa[elemId];
      var Xc = 0;
      var Yc = 0;

      var dDist = Math.sqrt(Math.pow(Xa - Xb, 2) + Math.pow(Ya - Yb, 2));
      var dTime = Tb - Ta;
      var dSpeed = dDist / dTime;
      dSpeed = Math.round(dSpeed * 100) / 100;

      var distX = Math.abs(Xa - Xb);
      var distY = Math.abs(Ya - Yb);

      var dVelX = (minDrift + (Math.round(distX * dSpeed * howMuch / (distX + distY))));
      var dVelY = (minDrift + (Math.round(distY * dSpeed * howMuch / (distX + distY))));

      var position = $('#' + elemId).position();
      var locX = position.left;
      var locY = position.top;

      if(Xa > Xb) { // we are moving left
        //console.log("left");
        Xc = locX - dVelX;
      } else { //  we are moving right
        //console.log("right");
        Xc = locX + dVelX;
      }
      // console.log("x = "+Xc);
      // console.log("dVelX = "+dVelX);
      if(Ya > Yb) { // we are moving up
        //console.log("up");
        Yc = (locY - dVelY);
      } else { // we are moving down
        //console.log("down");
        Yc = (locY + dVelY);
      }
      // console.log("y = "+Yc);
      // console.log("dVelY = "+dVelY);
      var newLocX = Xc + 'px';
      var newLocY = Yc + 'px';

      $('#' + elemId).animate({
        left: newLocX,
        top: newLocY
      }, 700, easeType);

    }; // END  dragmomentum.end()
  }; // END dragMomentum()
var showVideo = function(player) {

  }

$(function() {
  $.Topic('videoDownloaded').subscribe(prepareVideo);
  $.Topic('videoReady').subscribe(setupImageAndVideo);
  $.Topic('vimeoLoaded').subscribe(showVideo);
});