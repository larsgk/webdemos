// call init once the document is fully loaded
window.addEventListener('load', init, false);

/**
 * Initialization.
 *
 */

function $(id) { return document.getElementById(id); }


function lockPortrait() {
  try {
    if(screen.lockOrientation)
      screen.lockOrientation("portrait-primary");
    else if(screen.orientation) {
      screen.orientation.lock('portrait')
    }
  } catch (err) {
    showInfo(err)
  }
}

function init()
{
  mySkybox = itk.Skybox($("theworld"), "images/inside_");
  //myPlayer = itk.PaperPlane($("theworld"));

  lockPortrait()

  audioObj = new itk.Audio()
  audioObj.loadSound('firesound','audio/fire.mp3')
  audioObj.loadSound('reloadsound','audio/reload.mp3')

  animationFrame = new AnimationFrame()

  if (window.DeviceMotionEvent != undefined) {
  	m_lastTime = 0;
    window.addEventListener("devicemotion", OnDeviceMotion, false);

    // mouse press
    document.onselectstart = function() {return false;} // ie
    document.onmousedown=ds;
    document.onclick=ra;
    document.oncontextmenu = function (){ return false};
    document.onmousemove=handleMouseMove;

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
    mainbutton.addEventListener("touchend", handleTouchEnd, false);

    isTouching = false;

    lastTime=new Date().getTime()
    mainGameLoop();

  } else {
    window.addEventListener("mousedown", OnMouseDown, false);
    isTouching = true;
  }

  mySkybox.setRotation(0,0,0);

}

var scaleMovement = [2000/window.innerWidth, 300/window.innerHeight]
var scaleRot = [10/window.innerWidth, 50/window.innerHeight];
var centerPos = [0.5*window.innerWidth, 0.5*window.innerHeight];


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

function handleMouseMove(event) {
  ry = -(event.clientX-centerPos[0]) * scaleRot[0];
  rz = -(event.clientY-centerPos[1]) * scaleRot[1];
}

var _MAXAMMO = 10;
var ammoleft = 0;

var firing = false

function OnFireStart(event)
{
  controls = $("controls");
  controls.style.backgroundColor = "rgba(255,255,255,0.5)";

  var ammolist = $("ammo");

  if(ammolist.firstChild) {
    firing = true
    fireStartTime = new Date().getTime()
    rotateD = [0,0,0]
  }
  return cancelEvent(event);
}

function handleTouchEnd(event) {
  OnFireEnd()
  return cancelEvent(event);
}

function OnFireEnd()
{
  controls.style.backgroundColor = "rgba(80,80,80,0.5)";

  var ammolist = $("ammo");

  if(ammolist.firstChild) {
    if(firing) {
      $("theworld").style.perspective = "1200px"
      audioObj.playSound("firesound", 1.0,1.0,false)
      mySkybox.injectElementAtAngle("shot"+ammoleft);
      ammolist.removeChild(ammolist.firstChild);
      ammoleft--;
    }
  } else {
      initGame();
  }

  if(ammoleft == 0) {
    mainbutton.setAttribute("class","newgame");
  } else if(ammoleft == _MAXAMMO) {
    mainbutton.setAttribute("class","fire");
  }

  firing = false
}


function initGame()
{
  audioObj.playSound("reloadsound", 1.0,1.0,false)

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
  el.style.display = "inline-block";
  el.style.backgroundColor = "yellow";
  el.style.borderRadius = "15px";
  el.style.border = "3px solid rgba(100,100,20,0.2)";
  parent.appendChild(el);
}


function OnMouseDown(event)
{

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
  rx = event.accelerationIncludingGravity.y;
  ry = event.accelerationIncludingGravity.x;
  rz = -event.accelerationIncludingGravity.z;
}

var rotateX = 0.0;
var rotateY = 0.0;

var rotateD = [0,0,0,0,0,0]

function mainGameLoop() {
  now=new Date().getTime()
  timeDiff = now - lastTime
  lastTime = now

  rotateX = rz*scaleMovement[0];
  rotateY = -25*ry*scaleMovement[1];
  rotateZ = ry*5;

  if (firing && fireStartTime) {
    var fireDiffTime = now - fireStartTime
    if(fireDiffTime < 4000) {
      rotateD[Math.floor(Math.random()*6)] = 0.004 * fireDiffTime * (Math.random() - 0.5)
      rotateX += rotateD[0]
      rotateY += rotateD[1]
      rotateZ += rotateD[2]
      $("theworld").style.perspective = "" + (1200 + Math.floor(fireDiffTime*0.4)) + "px"
    } else {
      OnFireEnd()
    }
  }

  mySkybox.setRotation(rotateX, rotateY, rotateZ);

  animationFrame.request(mainGameLoop);
}
