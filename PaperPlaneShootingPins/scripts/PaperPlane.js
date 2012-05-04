// by Lars Knudsen (larsgk@gmail.com), 2011 

if (typeof(itk) == "undefined") { itk = {}; }
if (typeof($) == "undefined") { function $(id) { return document.getElementById(id); } }

var _paperPlaneCount = 0;

itk.PaperPlane = function(parent)
{
    var PaperPlane = {
        _init: function(parent) {
            this.ppid = "paperPlane_"+_paperPlaneCount;
            this.parent = parent;
            _paperPlaneCount++;
            
            this._generateElement();
            
            console.log("Created Paper Plane: " + this.ppid);
        },
        
        _generateElement: function() {
          this._injectPaperPlane(this.parent);
        },

        // skybox
        _injectPaperPlane: function(parent)
        {
            var el2d=document.createElement('div');
            el2d.id = this.ppid + "_parent";
            el2d.style.position = 'fixed';
            el2d.style.webkitTransformStyle = 'preserve-3d';
            parent.appendChild(el2d);

            var el=document.createElement('div');
            el.id = this.ppid;
            el.style.position = 'fixed';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.style.webkitTransition = "all 0.5s ease-out"; 
            el2d.style.webkitTransform = 'translateX(512px) translateY(256px)';

            //hack
            el.style.webkitTransform = 'translateY(100px) rotateX(-10deg) rotateY(10deg)';

            el2d.appendChild(el);

            // the main body
            this._injectObjectPart(el, this.ppid + "_body", "planebody1.png", 256, 256, "rotateX(90deg) translateZ(-32px)", false);
            this._injectObjectPart(el, this.ppid + "_sideright", "planesidetop1.png", 64, 204, "translateZ(-26px) rotateZ(90deg) rotateX(90deg) translateZ(128px)", false);
            this._injectObjectPart(el, this.ppid + "_sideleft", "planesidetop1.png", 64, 204, "translateZ(-26px) rotateZ(90deg) rotateX(90deg) translateZ(-128px)", false);

            this._injectObjectPart(el, this.ppid + "_rudderright", "planesiderudder1.png", 64, 52, "translateZ(100px) rotateZ(90deg) rotateX(90deg) translateZ(128px)", false);
            this._injectObjectPart(el, this.ppid + "_rudderleft", "planesiderudder1.png", 64, 52, "translateZ(100px) rotateZ(90deg) rotateX(90deg) translateZ(-128px)", false);
        },


        _injectObjectPart: function(parent, objid, texture, width, height, transform, wireframe)
        {
            var el=document.createElement('div');
            el.id = objid;
            el.style.position = 'fixed';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.style.webkitTransform = "translateX(-"+width*0.5+"px) translateY(-"+height*0.5+"px) "+transform;
            //el.style.webkitBackfaceVisibility = "hidden";

            // Hard coded to support the images provided - for now.
            el.style.width = width + 'px';
            el.style.height = height + 'px';

            parent.appendChild(el);

            if(wireframe) {
                el.style.border = "4px solid red";
                //el.innerHTML = "<p>"+objid+"</p>";
                el.style.color = "red";
                el.style.backgroundColor = "rgba(200,200,200,0.5)";
            } else {
                var im=document.createElement('img');
                im.setAttribute("src","images/"+texture);
                el.appendChild(im);
            }
        },

        setHeading: function(x,y) {
            // this function is one big hack ;-)
            $(this.ppid).style.webkitTransform = 'translateX('+x+'px) translateY('+y+'px) rotateX(-'+(10+(-y*0.05))+'deg) rotateY('+(-x*0.15)+'deg) rotateZ('+(x*0.2)+'deg)';

            $(this.ppid + "_rudderright").style.webkitTransform = "translateX(-32px) translateY(-26px) translateZ(100px) translateX("+(x*0.04)+"px) rotateZ(90deg) rotateX(90deg) translateZ(128px) rotateX("+(x*0.1)+"deg)";
            $(this.ppid + "_rudderleft").style.webkitTransform = "translateX(-32px) translateY(-26px) translateZ(100px) translateX("+(x*0.04)+"px) rotateZ(90deg) rotateX(90deg) translateZ(-128px) rotateX("+(x*0.1)+"deg)";
        }

    }

    PaperPlane._init(parent);
    return PaperPlane;
};


