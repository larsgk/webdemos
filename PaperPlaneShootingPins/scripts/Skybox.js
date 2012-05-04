// by Lars Knudsen (larsgk@gmail.com), 2011 

if (typeof(itk) == "undefined") { itk = {}; }
if (typeof($) == "undefined") { function $(id) { return document.getElementById(id); } }

var _skyboxCount = 0;

itk.Skybox = function(parent, texprefix)
{
    var Skybox = {
        _init: function(parent, texprefix) {
            this.sid = "skybox_"+_skyboxCount;
            this.parent = parent;
            this.texprefix = texprefix;
            _skyboxCount++;

            this._rx = 0;
            this._ry = 0;
            this._rz = 0;

            this._flip = true;
            
            this._generateElement();
            
            console.log("Created Sprite: " + this.sid);
        },
        
        _generateElement: function() {
          this._injectSkybox(this.parent);
        },

        // skybox
        _injectSkybox: function(parent)
        {
            var el2d=document.createElement('div');
            el2d.id = this.sid + "_parent";
            el2d.style.position = 'fixed';
            el2d.style.webkitPerspective = "1200";
            el2d.style.webkitTransformStyle = 'preserve-3d';
            parent.appendChild(el2d);

            var el=document.createElement('div');
            el.id = this.sid;
            el.style.position = 'fixed';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.style.webkitTransition = "all 0.5s ease-out"; 
            el2d.style.webkitTransform = 'translateX(512px) translateY(512px)';

            el2d.appendChild(el);

            this._injectSkyboxSide(el, "right", 0, -90, 0);
            this._injectSkyboxSide(el, "left", 0, 90, 0);

            this._injectSkyboxSide(el, "front", 0, 0, 0);
            this._injectSkyboxSide(el, "back", 0, 180, 0);

            this._injectSkyboxSide(el, "top", -90, 0, 0);
            this._injectSkyboxSide(el, "bottom", 90, 0, 0);
        },


        _injectSkyboxSide: function(parent, imgname, rotx, roty, rotz)
        {
            var size = 512;
            var s2 = size*0.5;
            var s4 = size*0.25;

            var el=document.createElement('div');
            el.style.position = 'fixed';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.style.webkitTransform = 'translateX(-'+s2+'px) translateY(-'+s2+'px) rotateX('+rotx+'deg) rotateY('+roty+'deg) rotateZ('+rotz+') translateZ(-'+2048+'px) scale(8)';
            el.style.webkitBackfaceVisibility = "hidden";

            // Hard coded to support the images provided - for now.
            el.style.width = '512px';
            el.style.height = '512px';

            parent.appendChild(el);

            var im=document.createElement('img');
            im.id = parent.id + "_img_"+imgname;
            im.setAttribute("src",this.texprefix+imgname+".jpg");
            el.appendChild(im);
        },

        _injectSkyboxSideObject: function(parent, objid, rotx, roty, rotz, tx, ty)
        {
            var size = 32;
            var s2 = size*0.5;
            var s4 = size*0.25;

            var el=document.createElement('div');
            el.id = objid;
            el.style.position = 'fixed';
            el.style.webkitTransformStyle = 'preserve-3d';
            el.style.webkitTransform = 'translateX(-'+s2+'px) translateY(-'+s2+'px) rotateX('+rotx+'deg) rotateY('+roty+'deg) rotateZ('+rotz+') translateZ(-2000px) translateX('+tx+'px) translateY('+ty+'px)';
            el.style.webkitBackfaceVisibility = "hidden";
            el.style.webkitBorderRadius = "16px";
            el.style.backgroundColor = "yellow";

            // Hard coded to support the images provided - for now.
            el.style.width = '32px';
            el.style.height = '32px';

            parent.appendChild(el);
/*
            var im=document.createElement('img');
            im.id = parent.id + "_img_"+imgname;
            im.setAttribute("src",this.texprefix+imgname+".jpg");
            el.appendChild(im);*/
        },

        changeTexture: function(texprefix) {
            this.texprefix = texprefix;
            $(this.sid+"_img_right").src = texprefix+"right.jpg";
            $(this.sid+"_img_left").src = texprefix+"left.jpg";
            $(this.sid+"_img_front").src = texprefix+"front.jpg";
            $(this.sid+"_img_back").src = texprefix+"back.jpg";
            $(this.sid+"_img_top").src = texprefix+"top.jpg";
            $(this.sid+"_img_bottom").src = texprefix+"bottom.jpg";
        },

        setRotation: function(rx,ry,rz) {
          this._rx = rx;
          this._ry = ry;
          this._rz = rz;
          $(this.sid).style.webkitTransform = 'translateZ(0px) rotateZ('+rz+'deg) rotateX('+rx+'deg) rotateY('+ry+'deg)';
        },

        injectElementAtAngle: function(objid) {
          // find side
          var tmpx = this.normalizeAngle(Math.floor(this._rx));
          var tmpy = this.normalizeAngle(Math.floor(this._ry));
          
          var side = "back";
          var rot = [0, 180, 0];
          if(tmpy >= -45 && tmpy <= 45) { side = "front"; rot = [0,0,0]; }
          if(tmpy > -135 && tmpy < -45) { side = "left"; rot = [0,90,0]; }
          if(tmpy < 135 && tmpy > 45) { side = "right"; rot = [0,-90,0]; }


          //$(this.sid+"_img_"+side).src = this.texprefix+(this._flip?"bottom.jpg":"top.jpg");
          this._flip = !this._flip;

          // find spot on plane
          tmpy = this.normalizeAngle90(tmpy);
          if(tmpy>44)tmpy=44;
          if(tmpy<-44)tmpy=-44;

          tmpx = this.normalizeAngle90(tmpx);
          //scale this one a bit - hack to fit with plane direction
          tmpx*=1.5;
          tmpx+=20;
          if(tmpx>44)tmpx=44;
          if(tmpx<-44)tmpx=-44;

          var tx = Math.floor(2048 * Math.tan(tmpy*3.1415/180.0));
          var ty = -Math.floor( 2048 * Math.tan(tmpx*3.1415/180.0));
          
          this._injectSkyboxSideObject( $(this.sid), objid, rot[0], rot[1], rot[2], tx,ty);
        },

        normalizeAngle: function(angle) {
          var result = angle;
          while(result < -180)result+=360;
          while(result >= 180 )result-=360;
          return result;
        },

        normalizeAngle90: function(angle) {
          var result = angle;
          while(result < -45)result+=90;
          while(result >= 45 )result-=90;
          return result;
        }


    }

    Skybox._init(parent, texprefix);
    return Skybox;
};


