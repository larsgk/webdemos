/*
 * Copyright (c) 2010, Lars Gunder Knudsen <larsgk@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Initialization.
 *
 */
function init()
{
    // Loading the rocket graphics and place it at (x,y) = (500,100)
    // Note:  On the web page, the coordinate system has "Y" going positive in a downwards direction
    // E.g. (0,0) = upper left corner and (100,200) = 100 pixels to the right and 200 pixels down.
    rocket = new itk.Sprite("MoonLander/rocket.png");
    rocket.position = [500,100];
    rocket.visible = true;
    
    // Position the landing pad.
    // The landing pad is constructed by a simple <div> tag in the html file and styled in basic.css
    landingPad = document.getElementById("landingPad");
    
    // The width is set to 128 - adjust this to what fits with the screen size you are working with.
    landingPadWidth = 128;
    landingPadHalfWidth = (landingPadWidth * 0.5);
    
    // The center of the landing pad will be randomly placed (x-direction) in the 
    // bottom of the browser window.
    landingPadCenter = landingPadHalfWidth + (window.innerWidth-landingPad.style.width) * Math.random();    
    landingPad.style.left = landingPadCenter - landingPadHalfWidth + 'px';
    landingPad.style.width = landingPadWidth + 'px';
    
    // Initialize a virtual touchpad on the web page
    // at (x,y) = (10,100) and (w,h) = (200,200)
    // The last parameter (set to 'true' here) indicates that we want
    // a dot displayed when using the touchpad. 
    touchPad = new itk.VirtualTouchpad( [10,100], [200, 200], true );
    

    // Handle touch down/move in the same function.
    // This will control the power and direction of the rocket thrusters.
    touchPad.onTouchDown = handleTouchCoord;
    touchPad.onTouchMove = handleTouchCoord;

    // Handle touch up in this function (will stop the rocket thrusters
    touchPad.onTouchUp   = handleTouchStop;

    // Acceleration and speed is initialized to zero in both x- and y-direction
    rocketAcceleration = [0,0];
    rocketSpeed        = [0,0];
    
    // The force of the thrusters is initialized to zero in both x- and y-direction
    // This will be directly affected by touching the virtual touchpad.
    thrusters = [0,0];
    
    // Gravity constant - set this to what feels good in the game
    gravity   = 0.2;

    // Current power usage.  This is a global variable affected in the "handleTouchCoord"  and 
    // "handleTouchStop" functions.  This variable can be used to help calculate energy consumption.
    thrustPower = 0;

    
    setInfoText("Please press somewhere in the square");
    
    // Start game loop
    gameLoop();
}

/**
 * Handles what should happen when the user presses or drags (around) on the virtual touchpad.
 * The thrusters' force are set to a small fraction of the output value of the VirtualTouchpad
 * (default = +/-100 in both directions).
 * 
 * @param {coord}   Sent from VirtualTouchpad notification - used to calculate angle and power.
 */
function handleTouchCoord(coord) {
    
    // Calculating the thrust angle based on the x/y coordinate from the touchpad.
    // Remember that the touchpad gives values from -100 to +100 in both directions.
    var thrustAngle = Math.round(180.0*Math.atan2(coord[0],-coord[1])/3.14159);
    
    // We apply the thrust angle to the rocket graphics to get the effect that the rocket's
    // thrust fits with the direction it's pointing.
    rocket.angle = thrustAngle;
    
    // Calculating the thrust power (distance from (0,0) on the touchpad).
    // This can later be used to do fuel consumption calculations - to make it a bit more exciting.
    // [Excercise:  Give the rocket some initial amount of fuel - and "spend" that fuel during flight.]
    thrustPower = Math.round(Math.sqrt( coord[0]*coord[0] + coord[1]*coord[1] ));
    setInfoText("Thrust:  Angle = " + thrustAngle + ", Power = " + thrustPower, true);
    thrusters = [coord[0]*0.008,coord[1]*0.008];    
}

/**
 * Handles what should happen when the user releases the virtual touchpad.
 * The thrusters are switched off (= force in both directions are set to 0)
 * 
 * @param {coord}   Unused currently - but sent from VirtualTouchpad notification
 */
 function handleTouchStop(coord) {
    setInfoText("Thusters off");
    thrusters = [0,0];
    thrustPower = 0;
}
    
/**
 * Display text in the element with the id = "infotext" (predefined in the html) 
 * (note: this is a convienience function for setInfoText(text, sticky))
 * 
 * @param {text}   The text to be displayed.
 */
 function setInfoText(text) {
    setInfoText(text, false);  // sticky = false
}
     
/**
 * Display text in the element with the id = "infotext" (predefined in the html) 
 *
 * @param {text}   The text to be displayed.
 * @param {sticky} Set to true if the note should not fade away after 2000 milliseconds.
 */
 function setInfoText(text, sticky) {
    var field = document.getElementById('infotext');
    field.innerHTML = text;
    var field_div = document.getElementById('infodiv');
    field_div.style.opacity = 1.0;
    if (!sticky) {
        setTimeout(disableInfoText, 2000);
    }
}
     
/**
 * All touchPad notifications are currently tied to this function
 * that will just display the currently touched coordinates.
 */
 function disableInfoText() {
    var field_div = document.getElementById('infodiv');
    field_div.style.opacity = 0.0;
}

/**
 * This is the main loop that creates the animation of the rocket and handles 
 * the effect applied forces (gravity and thrusters) have on acceleration -
 * and acceletation has on speed and position of the rocket.
 */
function gameLoop() {
    
    // Apply the current acceleration to the speed of the rocket.
    // "gravity" is a global constant set in "initialize" that will always pull a little downward.
    rocketSpeed = [rocketSpeed[0] + thrusters[0], rocketSpeed[1] + thrusters[1] + gravity];
    
    // Move (translate) the rocket with "rocketSpeed"
    rocket.translate = rocketSpeed;
    
    // Get the current position of the rocket (Sprite)
    rocketPos = rocket.position;
    
    // Here we check if the y-axis value (rocketPos[1]) of the rocket is 
    // above (remember - Y is positive in a downward direction in web pages) a certain 
    // threshold value. 
    if (rocketPos[1] > (window.innerHeight-50)) {
        
        // These values are printed to the console log of the webkit inspector ("debug output");
        // Use "console.log" whenever you are in doubt what some value is at a certain point
        // if you need something less intrusive than "alert()"
        console.log("rocketPos[0] = " + rocketPos[0]);
        console.log("landingPadCenter = " + landingPadCenter);
        console.log("landingPadHalfWidth = " + landingPadHalfWidth);
        
        // Do a simple calculation:  if the rocket is closer to the center of the landingpad (x-axis),
        // then we assume, the rocket has made the trip safe home.  If not, then we crash!
        // [Exercise:  Include the current speed and angle of the rocket to extend this check to see
        //             if it *really* is a safe landing]
        if ( Math.abs(rocketPos[0] - landingPadCenter) < landingPadHalfWidth ) {
            alert("YOU WON!");
        } else {
            alert("CRASH");
        }
    } else {
        
        // If the rocket has still not reached the bottom of the screen - continue the game loop
        // by calling the same function we are in - in 100 milliseconds
        setTimeout(gameLoop, 100);
    }
}
