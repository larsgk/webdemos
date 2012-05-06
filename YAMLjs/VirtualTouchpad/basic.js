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
    // Initialize a virtual touchpad on the web page
    // at (x,y) = (10,100) and (w,h) = (399,399)
    // The last parameter (set to 'true' here) indicates that we want
    // a dot displayed when using the touchpad. 
    touchPad = new itk.VirtualTouchpad( [10,100], [339,339], true );
    
    // All notifications/callbacks are pointing to the same function (defined below)
    touchPad.onTouchDown = handleTouchCoord;
    touchPad.onTouchUp   = handleTouchCoord;
    touchPad.onTouchMove = handleTouchCoord;
    
    setInfoText("Please press somewhere in the square");
}

/**
 * All touchPad notifications are currently tied to this function
 * that will just display the currently touched coordinates.
 *
 * @param {coord} Touch coordinates - sent with the notification (see VirtualTouchpad class description)
 */
function handleTouchCoord(coord) {
    setInfoText("touch (x, y) = (" + Math.round(coord[0]) + ", " + Math.round(coord[1]) + ")");
}
    
/**
 * Display text in the element with the id = "infotext" (predefined in the html) 
 *
 * @param {text} The text to be displayed.
 */
function setInfoText(text) {
    var field = document.getElementById('infotext');
    field.innerHTML = text;
    var field_div = document.getElementById('infodiv');
    field_div.style.opacity = 1.0;
    setTimeout(disableInfoText, 2000);
}
     
/**
 * All touchPad notifications are currently tied to this function
 * that will just display the currently touched coordinates.
 */
function disableInfoText() {
    var field_div = document.getElementById('infodiv');
    field_div.style.opacity = 0.0;
}
