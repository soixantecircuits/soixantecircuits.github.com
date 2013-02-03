/*
 * picked from http://stackoverflow.com/questions/5186441/javascript-drag-and-drop-for-touch-devices
 *
 */
function touchHandler(event)
{
    // trick to add support for touch event to elements/widgets that do not support it 
    // by convetting convert touchevents into mouseevents

    // only apply this trick to ui-draggable elements
    if ( ! $(event.target).hasClass('ui-draggable') ) { 
        return;
    }   

    var touches = event.changedTouches,
        first = touches[0],
        type = ""; 

    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;    
        case "touchend":   type="mouseup"; break;
        default: return;
    }   

    // convert touchevents into mouseevents
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                              first.screenX, first.screenY,
                              first.clientX, first.clientY, false,
                              false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
}

function init() {
    if (Modernizr.touch){
        // faster links for touch devices
        // by wiring directly touchend event as if it was a click (and disabling click handler) 
        var links = document.getElementsByTagName("a");
        for (var i=0; i < links.length; i++) {
            var link = links[i];
            if ( link.href !== undefined && link.href !== '') {
                link.addEventListener("click", function(e) {
                  e.preventDefault();
                }); 
                link.addEventListener("touchend", function() {
                  document.location = this.href;                                                                                                                                                                                                                                
                }); 
            }   
        };  

       // listen to touch events and provide support to them where needed 
       document.addEventListener("touchstart", touchHandler, true);
       document.addEventListener("touchmove", touchHandler, true);
       document.addEventListener("touchend", touchHandler, true);
       document.addEventListener("touchcancel", touchHandler, true);    
    }   
}