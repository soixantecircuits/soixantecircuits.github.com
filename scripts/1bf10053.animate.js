var dragMomentum = new function() {
    var howMuch = 30; // change this for greater or lesser momentum
    var minDrift = 6; // minimum drift after a drag move
    var easeType = 'easeOutBounce';

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

var slice = function(el) {
    var originalHtml = el.html(),
      originalHeight = el.height(),
      css = el.getStyleObject(),
      innerTop = $('<div />', {
        html: originalHtml
      }).css(css).css({
        margin: "0px"
      }),
      top = $('<div />', {
        "class": "slice sliceTop",
        html: innerTop
      }).css({
        height: originalHeight / 2
      }),
      innerBottom = $('<div />', {
        html: originalHtml
      }).css(css).css({
        position: "absolute",
        top: -originalHeight / 2,
        margin: "0px"
      }),
      bottom = $('<div />', {
        "class": "slice sliceBottom",
        html: innerBottom
      }).css({
        height: originalHeight / 2
      }),
      wrapper = $('<div />', {
        "class": "sliced-content"
      }).css({
        height: originalHeight,
        margin: el.css("margin"),
        padding: el.css("padding")
      });
    wrapper.append(top).append(bottom);
    el.before(wrapper).hide();
  };

var animate = function(top, bottom) {
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
  };

var animateInverse = function(top, bottom) {
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
  };