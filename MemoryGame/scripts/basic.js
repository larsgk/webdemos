// by Lars Knudsen (larsgk@gmail.com), 2011

window.addEventListener('load', init, false);

function $(id) {
  return document.getElementById(id); 
}

var loteria_cards = ["02","07","15","18","20","22","29","33"];

function randomizer() { 
    return Math.floor((Math.random()*loteria_cards.length)-1) 
} 

function init()
{
    var randCards = [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7].sort(randomizer);

    var cardNumber = 0;
    var j,i;
    for(i=0; i<4; i++) {
        for(j=0; j<4; j++) {
            injectCard($("gamearea"), "card0"+randCards[cardNumber]+"_"+cardNumber, 
                       "images/p200_loteria_"+loteria_cards[randCards[cardNumber]]+"_card.png", i, j);
            cardNumber++;
        }
    }
}

function ds(e){return false;}

function ra(){return true;}

maxTouch = 0;

function cancelEvent(e)
{
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function setInfo(text) {
  var el = document.getElementById("info");
  info.innerHTML = text;
}

var cardsSelected = new Array();

function writeTmpInfo(text) {
   //$("tmpinfo").innerHTML = text;
}

function flipCard(event) {
  writeTmpInfo("FLIPCARD: " + this.id + " - length = " + cardsSelected.length);
  if(cardsSelected.length>1) return;
  if(cardsSelected.length>0 && cardsSelected[0].id == this.id) return;

  if(this.className.indexOf("flipped")==-1)
    this.className = "flipped";

  cardsSelected.push(this);

  if(cardsSelected.length == 2)
    setTimeout(turnBackCards, 3000);
}

function turnBackCards() {
  // check if they are the same
  if(cardsSelected.length==2) {
    var id1 = cardsSelected[0].id;
    var id2 = cardsSelected[1].id;
    if(id1.substring(0,6) == id2.substring(0,6)) {
      while(cardsSelected.length>0) {
        var card = cardsSelected.pop();
        card.parentNode.removeChild(card);
      }      
    }
  }

  while(cardsSelected.length>0) {
    cardsSelected.pop().className = "flipback";
  }
  console.log("flipped all back");
}

function injectCard(parent, cardid, imagesrc, x, y) {

  var offx = 512 - 440 + x * 220;
  var offy = 512 - 440 + y * 220;

  // hacked for now...
  var el=document.createElement('div');
  el.id = cardid+"_parent";
  el.style.position = 'fixed';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = 'translateX('+offx+'px) translateY('+offy+'px) translateZ(-100px)';
  
  // Hard coded to support the images provided - for now.
  el.style.width = '200px';
  el.style.height = '200px';

  // hacked for now...
  var el2=document.createElement('div');
  el2.id = cardid;
  el2.style.position = 'absolute';
  el2.style.webkitTransformStyle = 'preserve-3d';
  el2.style.webkitTransform = 'rotateY(0deg)';
  el2.style.webkitAnimationDuration = '1s';
  el2.style.webkitAnimationFillMode = 'both';
  el2.style.webkitAnimationTimingFunction = 'ease-in-out';
  el2.addEventListener("touchstart", flipCard, false);
  el2.addEventListener("mousedown", flipCard, false);
  
  // Hard coded to support the images provided - for now.
  el2.style.width = '200px';
  el2.style.height = '200px';

  injectCardFront(el2, imagesrc);
  injectCardBack(el2, imagesrc);

  el.appendChild(el2);

  parent.appendChild(el);
}

function injectCardFront(parent, imagesrc)
{
  var el=document.createElement('div');
  el.style.position = 'absolute';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = ' rotateY(180deg)';
  el.style.webkitBackfaceVisibility = "hidden";

  // Hard coded to support the images provided - for now.
  el.style.width = '200px';
  el.style.height = '200px';

  parent.appendChild(el);

  var im=document.createElement('img');
  im.setAttribute("src",imagesrc);
  el.appendChild(im);
 }

function injectCardBack(parent)
{
  var el=document.createElement('div');
  el.style.position = 'fixed';
  el.style.webkitTransformStyle = 'preserve-3d';
  el.style.webkitTransform = '';
  el.style.webkitBackfaceVisibility = "hidden";

  // Hard coded to support the images provided - for now.
  el.style.width = '200px';
  el.style.height = '200px';

  parent.appendChild(el);

  var im=document.createElement('img');
  im.setAttribute("src","images/p200_cardback1.png");
  el.appendChild(im);
 }
