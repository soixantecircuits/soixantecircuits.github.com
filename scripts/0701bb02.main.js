"use strict";;
var sx = (function() {
  this.param = {
    display: "",
    altImage: "Soixante circuits - les projets",
    account: "soixantecircuits",
    dragElement: 0,
    totalElement: 0,
    vimeo_players: [],
    last_player: {},
    imageArray: [],
    content: [],
    imagePath: "images/",
    bodyColor: jQuery.Color( "rgb(0,148,168)" ),
    bodyLightness : jQuery.Color( "rgb(0,148,168)" ).lightness()
  },

  this.mixParagraphAndVideo = function() {
    this.disableInteraction();
    var video = $(".videoAction"),
      paragraph = $(".poetry p");

    $.each(paragraph, function(index, el) {
      var $videoEl = $(video.get(index)),
        ratio = $videoEl.attr("data-ratio"),
        height = (($videoEl.width()*$(window).width())/100)/ratio;
      $videoEl.parent().height(height);
      $videoEl.height(height);
      $(el).after($videoEl.parent().parent());
    });
  },
  this.disableDrag = function(){
    $(".ui-draggable").draggable( 'disable' );
  },
  this.disableResize = function(){
    $(".ui-resizable").resizable( 'disable' );
  },
  this.enableDrag = function(){
    $(".ui-draggable").draggable( 'enable' );
  },
  this.enableResize = function(){
    $(".ui-resizable").resizable( 'enable' );
  },
  this.disableInteraction = function(){
    this.disableDrag();
    this.disableResize();
  },
  this.enableInteraction = function(){
    this.enableDrag();
    this.enableResize();
  },
  this.initInteraction = function() {
    var _self = this;
    $('.canvasdraw').click(function() {
      $(this).css("zIndex", findMaxZIndex() + 1);
    });

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

    $('.canvasdraw').resizable({
      aspectRatio: true,
      resize: function(e, ui) {
        var frame = $(this).find("iframe");
        if(frame.length > 0) {
          $(this).height($(this).width() / frame.attr('data-ratio'));
          frame.height($(this).width() / frame.attr('data-ratio'));
        }

      }
    }).draggable({
      start: function(e, ui) {
        var size_factor = 0.1;
        TweenLite.to($(this), 0.1, {
          css: {
            boxShadow: "7px 9px 12px -2px rgb(0, 0, 0)",
            width: $(this).width() * (1 + size_factor)
          }
        });
        $(this).css("zIndex", findMaxZIndex() + 1);
        dragMomentum.start(this.id, e.clientX, e.clientY, e.timeStamp);
      },
      stop: function(e, ui) {
        _self.param.last_player = $(this).find('iframe');
        if(_self.param.last_player.length > 0) {
          setTimeout(function() {
            var iframe = $(_self.param.last_player)[0],
              player = $f(iframe);
            player.api('pause');
          }, 100);
        }
        var size_factor = 0.1,
          width = $(this).width();

        TweenLite.to($(this), 0.1, {
          css: {
            boxShadow: "0px 0px 0px 0px rgb(0, 0, 0)",
            width: width / (1 + size_factor)
          }
        });
        dragMomentum.end(this.id, e.clientX, e.clientY, e.timeStamp);
      },
      cursor: "move",
      delay: 100
    });
  },

  this.getVimeoVideos = function(user) {
    if(user !== "") {
      var _self = this;
      $.ajax({
        url: 'http://vimeo.com/api/v2/' + user + '/videos.json',
        dataType: 'jsonp',
        type: 'get'
      }).done(function(data) {
        var items = [];
        $.each(data, function(key, val) {
          items.push({
            "file": val.id.toString(),
            "type": "video",
            "size": {
              "height": val.width,
              "width": val.height
            },
            "ratio": val.width / val.height
          });
        });
        _self.prepareVideo(items);
      }).fail(function(data) {
        var items = [];
        _self.prepareVideo(items);
      });
    } else {
      console.log("Sorry no user to fetch");
    }
  },

  this.getImages = function() {
    var imagePrepend = "soixantecircuits_60circuits_interaction_developpement",
      imageExtension = ".jpg",
      imgNum = 0,
      maxNum = 9;
    for(var imgNum = 0; imgNum < maxNum; imgNum++) {
      this.param.imageArray.push({
        "file": imagePrepend + 0 + imgNum + imageExtension,
        "type": "image"
      });
    }
  },

  this.prepareVideo = function(video) {
    this.param.content = $.merge(this.param.imageArray, video);
    shuffle(this.param.content);
    this.setupImageAndVideo();
  },

  this.setupImageAndVideo = function() {
    var target = "#image",
      imgId = "img",
      steps = 0,
      delay = 0.5,
      radius = 300,
      variation = 0,
      nbElements = this.param.content.length,
      pointArray = give_me_a_point($(".main-content"), radius, variation, nbElements),
      _self = this;

    $.each(this.param.content, function(index, el) {
      var cell = $('<div />').attr({
        "class": "cell " + el.type
      }),
        displayElement = {};

      if(el.type === "image") {
        displayElement = $('<img />').attr({
          'id': imgId + index,
          'class': "imageAction",
          'src': _self.param.imagePath + el.file,
          'alt': _self.param.altImage
        });
      } else {
        displayElement = $('<iframe />').attr({
          'id': el.file,
          'class': "videoAction",
          'src': "http://player.vimeo.com/video/" + el.file + "?api=1&player_id=" + el.file,
          'width': "100%",
          'height': "100%",
          "frameborder": 0,
          'webkitAllowFullScreen': "",
          'mozallowfullscreen': "",
          'allowFullScreen': "",
          'data-ratio': el.ratio
        });
        var dragger = $('<div />').attr({
          class: "mask"
        });
        cell.append(dragger);
      }

      cell.prepend(displayElement);

      var container = $('<div />').attr({
        "class": "canvasdraw",
        "id": el.type + "_" + el.file.replace(".", "_")
      }).addClass("hide").append(cell);

      container.css({
        'top': steps + randomFromInterval(30, 10) + "px",
        'left': randomFromInterval(-20, 10) + "px",
        'width': randomFromInterval(20, 40) + "%",
        'zIndex': randomFromInterval(2, 100)
      });
      if(el.type === "video") {
        container.height(((container.width() / 100) * $("#image").width()) / el.ratio);
        container.find("iframe").height(((container.width() / 100) * $("#image").width()) / el.ratio);
      }

      container.appendTo($(target));

      TweenLite.to(container, 0, {
        css: {
          opacity: 0,
        }
      });

      displayElement.one('load', function() {
        _self.param.dragElement++;
        container.removeClass("hide");

        if(_self.param.display !== "mobile") {
          var point = pointArray.pop();
          TweenLite.to(container, 1, {
            css: {
              top: point.y + "px",
              left: point.x + "px",
              opacity: 1,
            },
            delay: delay
          });
          delay += 0.1;

          steps = findLowerImageBorder();
        }
        if(_self.param.dragElement >= nbElements) {
          _self.showVideo();
        }
      }).each(function() {
        if(this.complete) $(this).load();
      });
    });
    
    this.initInteraction();
    this.updateLayout();
  },

  this.showVideo = function() {
    this.prepareplayer();
  },

  this.updateLayout = function() {
    if(this.param.display === "mobile") {
      remove_style($(".canvasdraw"));
      this.mixParagraphAndVideo();
    }
  },

  this.prepareplayer = function() {
    var _self = this;
    $("iframe").each(function(index, el) {
      var iframe = $(el)[0],
        player = $f(iframe);
      _self.param.vimeo_players.push(player);
      // When the player is ready, add listeners for pause, finish, and playProgress
      player.addEvent('ready', function() {
        player.addEvent('pause', _self.onPause);
        player.addEvent('finish', _self.onFinish);
      });
    });
  },

  this.onPause = function(id) {
    $("#" + id).parent().find(".mask").show();
  },

  this.onFinish = function(id) {
    $("#" + id).parent().find(".mask").show();
  },

  this.init = function() {
    this.getImages();
    this.getVimeoVideos(this.param.account);
  };

  this.backgroundColor = function(){
    var _self = this;

      TweenMax.to($("body"), 15, {
        css:{
          "background-color":"rgb("+_self.param.bodyColor.toRgbaString()+")",
          ease:Power4.easeInOut
        },
        onComplete:function(){
          var lightness =  _self.param.bodyColor.lightness();
          lightness = (lightness <= _self.param.bodyLightness) ? 1 : _self.param.bodyLightness;

            
          _self.param.bodyColor = _self.param.bodyColor.lightness(lightness);
          _self.backgroundColor();
        }
      });
  }

});

$(function() {
  $.ajaxSetup({
    timeout: 2000
  });
  var site = new sx();
  site.init();
  enquire.register("screen and (max-width:576px)", {
    match: function() {
      $(".btn-group").addClass("btn-group-vertical");
      site.param.display = "mobile";
      site.updateLayout();
    },
    unmatch: function() {
      $(".btn-group").removeClass("btn-group-vertical");
    }
  }).listen();

  $("p").initialLetter({
    initialLetter: "dropped"
  });
  site.backgroundColor();
});