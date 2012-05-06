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

// A Virtual Touchpad class

/* example styles that can be applied to the VirtualTouchpad - put this in your *.css file
   and modify to fit the style of your page

.virtualTouchpad {
    background-color: rgba(150,150,150,0.5);
    border: 2px solid rgba(0,0,0,0.8);
    cursor:crosshair;
}

.virtualTouchpad:active {
    background-color: rgba(100,100,100,0.4);
    border: 2px solid rgba(0,0,0,0.8);
    cursor:crosshair;
}

.virtualTouchpadDot {
    background-color: rgba(255,0,0,1.0);
    border: 2px solid rgba(0,0,0,0.8);
}
*/

if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } } 
if (typeof(itk) == "undefined") { itk = {}; } 

var _virtualTouchpadCount = 0;

itk.VirtualTouchpad = function(position, size, shouldShowDot)
{
    var VirtualTouchpad = {
        /*
         * Constructor.
         *
         * @param {position}      The upper left corner position of the touchpad area (in pixels)
         * @param {size}          Width and height of the touchpad area (in pixels)
         * @param {shouldShowDot} A boolean value indicating if a dot should be shown when 
         *                        and where the touchpad is touched.
         */
        _init: function(position, size, shouldShowDot) {
            // init unique identifier
            this.sid = "virtualTouchpad_"+_virtualTouchpadCount;
            _virtualTouchpadCount++;
            
            // Should a dot be shown upon touch?
            this._shouldShowDot = shouldShowDot;
            
            // pos, angle, ...
            this._pos = position;
            this._size  = size;
            this._lastTouchCoord = [0,0];
            
            // The touch coordinate ranges
            // Default:  +/-100 in both x- and y-direction
            // [Exercise:  Try to extent the VirtualTouchpad class to support other ranges set by the user
            //             of the class]
            this._hRange = [-100,100];
            this._vRange = [-100,100];
                        
            // Generate/inject the HTML dynamically in the document. 
            this._generateElement();
            
            // Activate the touchpad
            this.active = true;
            
            console.log("Created Virtual Touchpad: " + this.sid);
        },
        
        /*
         * Injects <div> tags into the <body> tag of the main HTML document.
         * (Note: This is a common way of creating HTML on the fly that - to the browser - 
         * will have the same effect as if it was written in the html file itself.)
         */
        _generateElement: function() {
            var div_element=document.createElement('div');
            div_element.id = this.sid;
            div_element.style.position = 'fixed';
            div_element.style.opacity = 1.0;
            div_element.style.left   = this._pos[0] + 'px';
            div_element.style.top    = this._pos[1] + 'px';
            div_element.style.width  = this._size[0] + 'px';
            div_element.style.height = this._size[1] + 'px';
            div_element.style.zIndex = 1000;
            div_element.className = "virtualTouchpad";

            if (this._shouldShowDot) {
                var dot_element=document.createElement('div');
                dot_element.id = this.sid + "_dot";
                dot_element.style.position = 'fixed';
                dot_element.style.opacity = 0.0;
                dot_element.style.left   = this._pos[0] + 'px';
                dot_element.style.top    = this._pos[1] + 'px';
                dot_element.style.width  = '30px';
                dot_element.style.height = '30px';
                dot_element.style.zIndex = 900;
                dot_element.style.webkitBorderRadius = '15px';
                dot_element.className = "virtualTouchpadDot";
                document.getElementsByTagName("body")[0].appendChild(dot_element);
            }

            document.getElementsByTagName("body")[0].appendChild(div_element);
        },
        
        /*
         * Setter for the callback handler for the onTouchDown event
         *
         * @param {x} The callback function to receive the event.
         */
        set onTouchDown(x) {
            this._onTouchDown = x;
        },
        
        /*
         * Setter for the callback handler for the onTouchMove event
         *
         * @param {x} The callback function to receive the event.
         */
        set onTouchMove(x) {
            this._onTouchMove = x;
        },
        
        /*
         * Setter for the callback handler for the onTouchUp event
         *
         * @param {x} The callback function to receive the event.
         */
        set onTouchUp(x) {
            this._onTouchUp = x;
        },
        
        /*
         * Controlling the visibility of the touchpad (e.g. if you want to hide it for a moment)
         *
         * @param {x} true - visible, false - invisible
         */
        set visible(x) {
            this._visible = x;
            var el = document.getElementById(this.sid);
            if (el) {
                el.style.opacity = (this._visible?1.0:0.0);
            }
        },
        
        /*
         * Visible state
         *
         * @return The visible state of the virtual touchpad 
         */
        get visible() {
            return this._visible;
        },
        
        /*
         * Move the touchpad to a new position
         *
         * @param {x}  Coordinates (e.g. [200,240])
         */
        set position(x) {
            this._pos = x;
            
            var el = document.getElementById(this.sid);
            if (el) {
                el.style.left = this._pos[0]+'px';
                el.style.top  = this._pos[1]+'px';
            }
        },
        
        /*
         * Activates or deactivates the mouse handlers for the touchpad area.
         *
         * @param {x} true - active, false - inactive
         */
        set active(state) {
            this._state = state;
            
            var el = document.getElementById(this.sid);
            var self = this;
            
            if (this._state) {
                el.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
                el.addEventListener('mousemove', function(e) { return self.onMouseMove(e) }, false);
                el.addEventListener('mouseup',   function(e) { return self.onMouseUp(e) },   false);
            } else {
                el.removeEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
                el.removeEventListener('mousemove', function(e) { return self.onMouseMove(e) }, false);
                el.removeEventListener('mouseup',   function(e) { return self.onMouseUp(e) },   false);
            }
        },
        
        /*
         * Handler for the mousedown event
         *
         * @param {event} Event passed on from the browsers mouse event.
         */
        onMouseDown: function(event) {
            if(this._shouldShowDot) this._showDot(event);
            this._lastTouchCoord = this._toTouchCoord(event);
            console.log("mouseDown (x, y) = (" + this._lastTouchCoord[0] + ", " + this._lastTouchCoord[1] + ")");
            if (this._onTouchDown) this._onTouchDown(this._lastTouchCoord);
            this._mouseIsPressed = true;
            return false;
        },
        
        /*
         * Handler for the mousemove event
         *
         * @param {event} Event passed on from the browsers mouse event.
         */
        onMouseMove: function(event) {
            // As this is a touchpad - we are only interested in 
            // processing this event if the mouse is pressed
            if (this._mouseIsPressed) {
                if(this._shouldShowDot) this._showDot(event);
                this._lastTouchCoord = this._toTouchCoord(event);
                console.log("mouseMove (x, y) = (" + this._lastTouchCoord[0] + ", " + this._lastTouchCoord[1] + ")");
                if (this._onTouchMove) this._onTouchMove(this._lastTouchCoord);
            }
            return false;
        },
        
        /*
         * Handler for the mouseup event
         *
         * @param {event} Event passed on from the browsers mouse event.
         */
        onMouseUp: function(event) {
            if(this._shouldShowDot) this._hideDot();
            this._lastTouchCoord = this._toTouchCoord(event);
            console.log("mouseUp (x, y) = (" + this._lastTouchCoord[0] + ", " + this._lastTouchCoord[1] + ")");
            if (this._onTouchUp) this._onTouchUp(this._lastTouchCoord);
            this._mouseIsPressed = false;
            return false;
        },
        
        /*
         * Displays a dot in the trackpad area when the mouse is pressed/dragged.
         * Remember to style the dot in the css (see top of this file)
         *
         * @param {event} Event passed on from the browsers mouse event - using the cooordinates for the dot.
         */
         _showDot: function(event) {
            var el = document.getElementById(this.sid+"_dot");
            
            if(el) {
                el.style.opacity = 1.0;
                el.style.left = (event.clientX-15) + 'px';
                el.style.top  = (event.clientY-15) + 'px';
            }
        },
        
        /*
         * Hides the dot when the mouse is released in the trackpad area
         */
        _hideDot: function() {
            var el = document.getElementById(this.sid+"_dot");
            
            if(el) {
                el.style.opacity = 0.0;
            }
        },
        
        /*
         * Convert screen coordinates to trackpad coordinates using the 
         * ranges defined in the constructor (init())
         *
         * @param {event} Event passed on from the browsers mouse event - using the cooordinates.
         */
        _toTouchCoord: function(event) {
            var x = ((event.clientX-this._pos[0]) * (this._hRange[1] - this._hRange[0])/(this._size[0])) + this._hRange[0];
            var y = ((event.clientY-this._pos[1]) * (this._vRange[1] - this._vRange[0])/(this._size[1])) + this._vRange[0];
            
            return [x,y];
        }       
    }

    VirtualTouchpad._init(position, size, shouldShowDot);
    return VirtualTouchpad;
};

