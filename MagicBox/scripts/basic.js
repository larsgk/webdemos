// by Lars Knudsen (larsgk@gmail.com), 2011

// call init once the document is fully loaded
window.addEventListener('load', init, false);

/**
 * Initialization.
 *
 */

function $(id) {
  return document.getElementById(id); 
}

function init()
{
  injectCube($("dicetable"), "magiccube", 0,0,2);
  injectFlareLayer($("dicetable"));

  // Activate the following when MediaQuery listener works on more platforms.
  //var mql = window.matchMedia("(orientation:portrait)");
  //mql.addListener(OnOrientationChange);
  //OnOrientationChange(mql);

  window.addEventListener("resize",crudeOrientationDetection,false);
  crudeOrientationDetection();

  if (window.DeviceMotionEvent != undefined) {
  	m_lastTime = 0;
    window.addEventListener("devicemotion", OnDeviceMotion, false);

    // mouse press
    document.onselectstart = function() {return false;} // ie
    document.onmousedown=ds;
    document.onclick=ra;
    document.oncontextmenu = function (){ return false};

    touchLayer = document.getElementById("touchlayer");

    touchLayer.addEventListener("touchstart", OnTouchMove, false);
    touchLayer.addEventListener("touchmove", OnTouchMove, false);
    touchLayer.addEventListener("touchend", OnTouchEnd, false);

    isTouching = false;

  } else
    window.addEventListener("mousemove", OnMouseMove, false);
}

var _isPortrait = true;

function ds(e){return false;}

function ra(){return true;}

function cancelEvent(e)
{
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

// until mediaquerylistener works on more platforms
function crudeOrientationDetection()
{
  if(window.innerWidth > window.innerHeight)
    _isPortrait = false;
  else
    _isPortrait = true;

  scaleRot = [60/window.innerWidth, 60/window.innerHeight];
  centerPos = [0.5*window.innerWidth, 0.5*window.innerHeight];
}

function rotateCube(rx,ry)
{
  var cube = $("magiccube");
  cube.style.webkitTransform = 'translateZ(-600px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
   
  // The following is "too hard to handle" for mobile devices.. 
  // commented out until a better solution is found.
  setSaturationFlareLayer(rx,ry);
}

function setSaturationFlareLayer(rx,ry) {
  // adjust the color of the flare layer
  var el = $("flarelayer");

  // hard coded from where sides are...
  var r = (ry>5?ry*25:0);
  var b = (ry<-5?-ry*25:0);
  
  var g = (rx<-5?-rx*25:0);

  g += (rx>1?rx*17:0);
  r += (rx>1?rx*17:0);

  var a = 0.01 * Math.sqrt((rx*rx) + (ry*ry));

  if(r>255)r=255;
  if(g>255)g=255;
  if(b>255)b=255;

  r = Math.floor(r);
  g = Math.floor(g);
  b = Math.floor(b);

  if(a>0.8)a=0.8;
  
  console.log('rgb('+r+','+g+','+b+')');

  el.style.backgroundColor = 'rgb('+r+','+g+','+b+')';
  el.style.opacity = a;
}

function OnMouseMove(event)
{
  var rotateY = (event.clientX-centerPos[0]) * scaleRot[0];
  var rotateX = (event.clientY-centerPos[1]) * scaleRot[1];

  rotateCube(-rotateX, rotateY);
}

function OnTouchMove(event)
{
  isTouching = true;
  var rotateY = (event.touches[0].clientX-centerPos[0]) * scaleRot[0];
  var rotateX = (event.touches[0].clientY-centerPos[1]) * scaleRot[1];

  rotateCube(-rotateX, rotateY);
  event.preventDefault();
  return cancelEvent(event);
}

function OnTouchEnd(event)
{
  rotateCube(0, 0);
  event.preventDefault();

  isTouching = false;
  return cancelEvent(event);
}

function OnOrientationChange(evt)
{
  _isPortrait = evt.matches;
}

rotateX = 0;
rotateY = 0;

function OnDeviceMotion(event) {

  if(isTouching) return;

  rotateY += rotateY*2 + 5*event.accelerationIncludingGravity.x;
  rotateY *= 0.25;
  rotateX += rotateX*2 + 5*event.accelerationIncludingGravity.y;
  rotateX *= 0.25;

  var time = (new Date()).getTime();
	// force delay between frames
	if(time - m_lastTime > 16) {
      if(_isPortrait)
        rotateCube(rotateX, rotateY);
      else
        rotateCube(rotateY, -rotateX);
	}
}

function injectFlareLayer(parent)
{
  var el=document.createElement('div');
  el.id = "flarelayer";
  el.style.position = 'absolute';
  el.style.width = '512px';
  el.style.height = '512px';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = 'scale(8.0) translateZ(0px)';
  parent.appendChild(el);
}

function injectCube(parent, cubeid, xpos, ypos)
{
  var el2d=document.createElement('div');
  el2d.id = cubeid + "_parent";
  el2d.style.position = 'absolute';
  el2d.style.webkitTransformStyle = 'preserve-3d';
  el2d.style.webkitTransform = 'translateX('+xpos+'px) translateY('+ypos+'px)';
  parent.appendChild(el2d);

  var el=document.createElement('div');
  el.id = cubeid;
  el.style.position = 'absolute';
  el.style.webkitTransformStyle = 'preserve-3d';
  el2d.style.webkitTransform = 'translateX(512px) translateY(512px)';

  el2d.appendChild(el);

  el.style.webkitTransform = 'translateZ(-600px)';

  injectCubeSide(el, "images/silver-side.jpg", 0, 0, 0);
  injectCubeSide(el, "images/red-side.jpg", 0, -90, 0);
  injectCubeSide(el, "images/yellow-side.jpg", -90, 0, 0);
  injectCubeSide(el, "images/green-side.jpg", 90, 0, 0);
  injectCubeSide(el, "images/blue-side.jpg", 0, 90, 0);
  injectLargePlate(el, 1024, "rgba(16,16,16,0.5)", 0, 180, 0);
}

function injectCubeSide(parent, imagesrc, rotx, roty, rotz)
{
  var el=document.createElement('div');
  el.style.position = 'absolute';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = ' translateX(-256px) translateY(-256px) rotateX('+rotx+'deg) rotateY('+roty+'deg) rotateZ('+rotz+') translateZ(256px)';
  el.style.borderRadius = "50px";

  // Hard coded to support the images provided - for now.
  el.style.width = '512px';
  el.style.height = '512px';

  parent.appendChild(el);

  var im=document.createElement('img');
  im.setAttribute("src",imagesrc);
  el.appendChild(im);
 }

function injectLargePlate(parent, size, color, rotx, roty, rotz)
{
  var s2 = size*0.5;
  var s4 = size*0.25;
  var el=document.createElement('div');
  el.style.position = 'absolute';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = ' translateX(-'+s2+'px) translateY(-'+s2+'px) rotateX('+rotx+'deg) rotateY('+roty+'deg) rotateZ('+rotz+') translateZ(256px)';
  el.style.borderRadius = s4+"px";

  // Hard coded to support the images provided - for now.
  el.style.width = size+'px';
  el.style.height = size+'px';
  el.style.background = color;

  parent.appendChild(el);
 }
