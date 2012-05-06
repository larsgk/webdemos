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
 
// A Keyboard Handler class 

if (typeof(console) == "undefined") { console = {}; } 
if (typeof(console.log) == "undefined") { console.log = function() { return 0; } } 
if (typeof(itk) == "undefined") { itk = {}; } 

itk.KeyboardHandler = function(callback)
{
    var KeyboardHandler = {
        _init: function(callback) {
            this._callback = callback;
            
            // init vars            
            var self = this;
            if (document.addEventListener) {
                document.addEventListener("keydown",function(event) { self.keydown(event); },false);
                document.addEventListener("keyup",function(event) { self.keyup(event); },false);
            }
            
            console.log("Created KeyboardHandler: " + this.sid);
        },
        
        keydown: function(e) {
            if(!e.keyIdentifier) this._addData(e,true);
            
            var keyValue = String.fromCharCode(e.keyCode);
            console.log("[DOWN] KeyValue: '" + keyValue + "' KeyIdentifyer: " + e.keyIdentifier);
            this._callback(e);
            return false;
        },

        keyup: function(e) {
            if(!e.keyIdentifier) this._addData(e,false);
            
            var keyValue = String.fromCharCode(e.keyCode);
            console.log("[UP] KeyValue: '" + keyValue + "' KeyIdentifyer: " + e.keyIdentifier);
            this._callback(e);
            return false;
        },
        
        _addData: function(e, isDown) {
            if( e.which == 37 ) e.keyIdentifier = "Left";
            else if( e.which == 38) e.keyIdentifier = "Up";
            else if( e.which == 39) e.keyIdentifier = "Right";
            else if( e.which == 40) e.keyIdentifier = "Down";
        }
    }

    KeyboardHandler._init(callback);
    return KeyboardHandler;
};

