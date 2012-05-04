// by Lars Knudsen (larsgk@gmail.com), 2011 

// call init once the document is fully loaded
window.addEventListener('load', init, false);

/**
 * Initialization.
 *
 */

function $(id) { return document.getElementById(id); }


function init()
{
  mySkybox = itk.Skybox($("theworld"), "images/inside_");
  injectFloatingText($("theworld"), "infotext", -256, -1000);
  myPlayer = itk.PaperPlane($("theworld"));

  // accelerometer and more
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

    touchLayer = $("touchlayer");

    touchLayer.addEventListener("touchstart", cancelEvent, false);
    touchLayer.addEventListener("touchmove", cancelEvent, false);
    touchLayer.addEventListener("touchend", cancelEvent, false);

    controls = $("controls");
    controls.addEventListener("touchstart", cancelEvent, false);
    controls.addEventListener("touchmove", cancelEvent, false);
    controls.addEventListener("touchend", cancelEvent, false);

    mainbutton = $("mainbutton");
    mainbutton.addEventListener("touchstart", OnFireStart, false);
    mainbutton.addEventListener("touchmove", cancelEvent, false);
    mainbutton.addEventListener("touchend", OnFireEnd, false);

    isTouching = false;

    mainGameLoop();

  } else {
    window.addEventListener("mousedown", OnMouseDown, false);
    isTouching = true;
  }

  mySkybox.setRotation(0,0,0);

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

// until mediaquerylistener works in N950
function crudeOrientationDetection()
{
  if(window.innerWidth > window.innerHeight)
    _isPortrait = false;
  else
    _isPortrait = true;

  scaleRot = [10*60/window.innerWidth, 30/window.innerHeight];
  centerPos = [0.5*window.innerWidth, 0.5*window.innerHeight];

  scaleMovement = [2000/window.innerWidth, 300/window.innerHeight]
}

var _MAXAMMO = 10;
var ammoleft = 0;

function OnFireStart(event)
{
  controls = $("controls");
  controls.style.backgroundColor = "rgba(255,255,255,0.5)";

  var ammolist = $("ammo");

  if(ammolist.firstChild) {
    $("firesound").play();
    mySkybox.injectElementAtAngle("shot"+ammoleft);
    ammolist.removeChild(ammolist.firstChild);
    ammoleft--;
} else {
    initGame();
}


  return cancelEvent(event);
}

function OnFireEnd(event)
{
  //controls = $("controls");
  controls.style.backgroundColor = "rgba(80,80,80,0.5)";

  if(ammoleft == 0) {
    mainbutton.setAttribute("class","newgame");
  } else if(ammoleft == _MAXAMMO) {
    mainbutton.setAttribute("class","fire");
  }

  return cancelEvent(event);
}


function initGame()
{
  $("reloadsound").play();

  var ammoel = $("ammo");
  for(var i=0;i<_MAXAMMO;i++) {
    injectAmmo(ammoel);
  }

  for(var i=_MAXAMMO;i>=0;i--) {
    var shotElement = $("shot"+i);
    if(shotElement) shotElement.parentNode.removeChild(shotElement);
    else break;
  } 
  ammoleft = _MAXAMMO;
}

function injectAmmo(parent) {
  var el=document.createElement('div');
  el.style.position = 'relative';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.margin = "40px 10px";
  el.style.float = "right";
  el.style.backgroundColor = "yellow";
  el.style.webkitBorderRadius = "15px";
  el.style.border = "3px solid rgba(100,100,20,0.2)";
  parent.appendChild(el);
}


function OnMouseDown(event)
{
  var rotateY = (event.clientX-centerPos[0]) * scaleRot[0];
  var rotateX = (event.clientY-centerPos[1]) * scaleRot[1];

  myPlayer.setHeading((event.clientX-centerPos[0]), (event.clientY-centerPos[1]));

  mySkybox.setRotation(-rotateX, rotateY,0);
}

function OnOrientationChange(evt)
{
  _isPortrait = evt.matches;
}

function changeSkyset(num) {
  var prefix = num==1?"images/mountain_":"images/inside_";
  mySkybox.changeTexture(prefix);
}

var rx = 0.0;
var ry = 0.0;
var rz = 0.0;

function OnDeviceMotion(event) {

  if(isTouching) return;

  if(_isPortrait) {
    rx = event.accelerationIncludingGravity.y;
    ry = event.accelerationIncludingGravity.x;
    rz = event.accelerationIncludingGravity.z;
  } else {
    rx = -event.accelerationIncludingGravity.x;
    ry = -event.accelerationIncludingGravity.y;
    rz = event.accelerationIncludingGravity.z;
  }
}

var rotateX = 0.0;
var rotateY = 0.0;

function mainGameLoop() {

  rotateX += rotateX*2 + 5*(rz*scaleMovement[0]+2)*0.5;
  rotateX *= 0.25;
  rotateY += rotateY*3 + 5*ry*scaleMovement[1];
  rotateY *= 0.25;

  myPlayer.setHeading(ry*30, -rz*20);  
  mySkybox.setRotation(rotateX, rotateY, -ry*5);

  setTimeout(mainGameLoop, 40);
}

// floating text


function hideText()
{
 $("infotext_parent").style.opacity = 0;
}

function injectFloatingText(parent, elementid, xpos, ypos)
{
  var el2d=document.createElement('div');
  el2d.id = elementid + "_parent";
  el2d.style.position = 'fixed';
  el2d.style.webkitTransformStyle = 'preserve-3d';

// hack
el2d.style.opacity = 1;
el2d.style.webkitTransition = "opacity 4s ease-out";
setTimeout(hideText, 8000);

  parent.appendChild(el2d);

  var el=document.createElement('div');
  el.id = elementid;
  el.style.position = 'fixed';
  el.style.webkitTransformStyle = 'preserve-3d';
  el2d.style.webkitTransform = 'translateX('+window.innerWidth*0.5+'px) translateY('+window.innerHeight*0.5+'px)';

  el2d.appendChild(el);

  injectTextPlane(el, "Paper Plane Shooting Pins!!!<br>by Lars Gunder Knudsen<br>Designed for landscape use<br>Move: DeviceOrientation<br>Red button: shoot/Green button: new game", 400, true);
}

function injectTextPlane(parent, text, width, shouldrotate)
{
  var el=document.createElement('div');
  el.style.position = 'fixed';
  el.style.webkitTransformStyle = 'preserve-3d';
  // Hard coded to support the images provided - for now.
  el.style.width = '512px';
  el.style.height = '512px';
  //el.style.webkitTransformOrigin = "50% 50%";
  
  parent.appendChild(el);

  var textel=document.createElement('div');
  

  textel.style.textAlign = "center";
  textel.style.fontSize = "20px";
  textel.style.border = "4px dotted #7f7f7f";
  textel.style.webkitTransformStyle = 'preserve-3d';
  textel.style.width = width + "px";
  if(shouldrotate) {
     textel.style.webkitAnimationName = "textspin";
     textel.style.webkitAnimationDuration = "12s";
     textel.style.webkitAnimationIterationCount = "infinite";
     textel.style.webkitAnimationTimingFunction = "linear";
  }

  textel.innerHTML = text;

  el.style.webkitTransform = 'translateX(-'+width*0.5+'px) translateY(-'+200+'px)';
  
  el.appendChild(textel);
 }



