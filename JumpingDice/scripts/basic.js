// by Lars Knudsen (larsgk@gmail.com), June, 2011

// call init once the document is fully loaded
window.addEventListener('load', init, false);

function $(id) { return document.getElementById(id); }

/**
 * Initialization.
 *
 */
function init()
{
  injectCube(document.getElementById("dicetable"), "cube1", 1100,-350,2);
  injectCube(document.getElementById("dicetable"), "cube2", 100, -350,4);
  injectCube(document.getElementById("dicetable"), "cube1", 1000,550,5);
  injectCube(document.getElementById("dicetable"), "cube2", 100, 550,2);
}

function injectCube(parent, cubeid, xpos, ypos, spd)
{
  var el2d=document.createElement('div');
  el2d.style.position = 'absolute';
  el2d.style.webkitTransformStyle = 'preserve-3d';
  el2d.style.webkitTransform = 'translateX('+xpos+'px) translateY('+ypos+'px)';
  parent.appendChild(el2d);

  var el=document.createElement('div');
  el.id = cubeid;
  el.style.position = 'absolute';
  el.style.webkitTransformStyle = 'preserve-3d';
  el2d.appendChild(el);

  el.style.webkitTransform = 'translateZ(-2000px) rotateX(45deg) rotateY(10deg)';

  el.style.webkitAnimationName = 'y-spin';
  el.style.webkitAnimationDuration = spd+'s';
  el.style.webkitAnimationIterationCount = 'infinite';
  el.style.webkitAnimationTimingFunction = 'linear';

  injectCubeSide(el, "images/die-tex-1.jpg", 0, 0, 0);
  injectCubeSide(el, "images/die-tex-2.jpg", 0, -90, 0);
  injectCubeSide(el, "images/die-tex-3.jpg", -90, 0, 0);
  injectCubeSide(el, "images/die-tex-4.jpg", 90, 0, 0);
  injectCubeSide(el, "images/die-tex-5.jpg", 0, 90, 0);
  injectCubeSide(el, "images/die-tex-6.jpg", 0, 180, 0);
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
//  im.style.borderRadius = "256px";
  el.appendChild(im);
}

var accuValue = 0.0;
var accuCount = 0;

function fpsCalc(timestamp){

  //calculate difference since last repaint
  var drawStart = (timestamp || Date.now()),
      diff = drawStart - startTime;

  //use diff to determine correct next step

  accuValue += diff;
  accuCount++;

  if(accuCount >= 100) {
    $('fpscount').innerHTML = "FPS:" + Math.floor(100000.0 / accuValue);
    accuValue = 0.0;
    accuCount=0;
  }

  //reset startTime to this repaint
  startTime = drawStart;

  //draw again
  requestAnimationFrame(fpsCalc);
}

var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame,
        startTime = window.mozAnimationStartTime || Date.now();

requestAnimationFrame(fpsCalc);

