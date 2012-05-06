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
 
if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } } 
if (typeof(itk) == "undefined") { itk = {}; } 

var _spriteCount = 0;

itk.Sprite = function(filename)
{
    var Sprite = {
        /*
         * Constructor.
         *
         * @param {filename}      Image file to be loaded
         */
        _init: function(filename) {
            this.sid = "sprite_"+_spriteCount;
            this.filename = filename;
            _spriteCount++;
            
            // pos, angle, ...
            this._pos = [0.0,0.0];
            this._angle = 0.0;
            
            this._radAngle = 0.0;
            
            // load image
            this.img = new Image();
            var self = this;
            this.img.onload = function(){ self._onLoadImg(); }; 
            this.img.src = this.filename;
            console.log("[sprite:"+this.sid+"] Loading "+this.img.src);
            
            this._generateElement();
            
            console.log("Created Sprite: " + this.sid);
        },
                
        /*
         * Injects <div> tags into the <body> tag of the main HTML document.
         * (Note: This is a common way of creating HTML on the fly that - to the browser - 
         * will have the same effect as if it was written in the html file itself.)
         */
        _generateElement: function() {
            var div_element=document.createElement('div');
            div_element.id = 'd_'+this.sid;
            div_element.style.position = 'absolute';
            div_element.style.opacity = 0.0;
            div_element.style.webkitTransformOrigin = "50% 50%";
            div_element.style.mozTransformOrigin = "50% 50%";
            div_element.style.webkitTransition = 'all 0.2s ease-out';
            
            var img_element=document.createElement('img');
            img_element.id = 'i_'+this.sid;
            img_element.setAttribute("src",this.filename);
            img_element.style.webkitTransformOrigin = "50% 50%";
            img_element.style.mozTransformOrigin = "50% 50%";
            div_element.appendChild(img_element);

            document.getElementsByTagName("body")[0].appendChild(div_element);
        },
        
        /*
         * Handle further initialization when the image has loaded.
         * Things like image width/height, etc. are unknown until this point.
         */
        _onLoadImg: function() {
            // Last sprite determines size (quick hack)
            this._width = this.img.width;
            this._height = this.img.height;
            var el = document.getElementById('d_'+this.sid);
            // to be used for positioning
            this._w2 = this._width * 0.5;
            this._h2 = this._height * 0.5;

            if( el ) {
                el.style.width = this._width+'px';
                el.style.height = this._height+'px';
                el.style.left = Math.round(-this._w2)+'px';
                el.style.top = Math.round(-this._h2)+'px';
            }

            console.log("Img size: (w,h) = (" + this._width + "," + this._height + ")");    
            
            if( this._onload ) {
               this._onload( this.sid );
            }
        },
        
        /*
         * Controlling the visibility of the sprite (e.g. if you want to hide it for a moment)
         *
         * @param {x} true - visible, false - invisible
         */
        set visible(x) {
            this._visible = x;
            var el = document.getElementById('d_'+this.sid);
            if( el ) {
                //alert(el.style.visibility);
                el.style.opacity = (this._visible?1.0:0.0);
            }
        },
        
        /*
         * Visible state
         *
         * @return The visible state of the sprite 
         */
        get visible() {
            return this._visible;
        },
        
        /*
         * Move the sprite to a new position
         * Note:  You should use "translate" to do relative movement.
         *
         * @param {x}  Coordinates (e.g. [200,240])
         */
        set position(x) {
            this._pos = x;
            
            if( this._onPosChange ) this._onPosChange(this._pos);
            
            var el = document.getElementById('d_'+this.sid);
            if( el ) {
                el.style.webkitTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
                el.style.MozTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
            }
        },
        
        /*
         * Returns the current position
         *
         * @return Current position (e.g. [200,240])
         */
        get position() {
            return this._pos;
        },
        
        /*
         * Move the sprite relatively (to a new position)
         *
         * @param {x}  Delta coordinates (e.g. [-10,20])
         */
        set translate(x) {
            this._pos = [this._pos[0]+x[0],this._pos[1]+x[1]];
            if( this._onPosChange ) this._onPosChange(this._pos);
            
            var el = document.getElementById('d_'+this.sid);
            if( el ) {
                el.style.webkitTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
                el.style.MozTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
            }
        },
                
        /*
         * Move the sprite "forward" (to a new position) using the current angle
         *
         * @param {x}  Scalar/value to move "forward" (e.g. 20.5)
         */
        set moveForward(x) {
            this._pos = [
               this._pos[0]+(x*Math.cos(this._radAngle)),
               this._pos[1]+(x*Math.sin(this._radAngle))
               ];
            if( this._onPosChange ) this._onPosChange(this._pos);
            
            var el = document.getElementById('d_'+this.sid);
            if( el ) {
                el.style.webkitTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
                el.style.MozTransform = 'translate('+this._pos[0]+'px,'+this._pos[1]+'px)';
            }
        },
        
        
        /*
         * Set the sprite angle in degrees
         *
         * @param {x}  Absolute angle (e.g. 45)
         */
        set angle(x) {
            this._angle = x;
            this._radAngle = (x*3.14159265)/180.0;
            var el = document.getElementById('i_'+this.sid);
            if( el ) {
                el.style.webkitTransition = 'all 0.2s ease-out';
                el.style.webkitTransform = 'rotate('+this._angle+'deg)';
                
                el.style.MozTransition = 'all 0.2s ease-out';
                el.style.MozTransform = 'rotate('+this._angle+'deg)';

            }
        },
        
        /*
         * Change the current angle relatively in degrees
         *
         * @param {x}  Relative/delta angle (e.g. 5)
         */
        set turn(x) {
            this.angle = this._angle + x;
        }
    }

    Sprite._init(filename);
    return Sprite;
};

