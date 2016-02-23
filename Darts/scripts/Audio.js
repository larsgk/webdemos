// an Audio class

if (typeof(console) == "undefined") { console = {} }
if (typeof(console.log) == "undefined") { console.log = function() { return 0 } }
if (typeof(itk) == "undefined") { itk = {} }

itk.Audio = function()
{
    var audio = {
        _init: function() {
            // Example showing how to produce a tone using Web Audio API.
            this.oscillator = null
            this.amp = null
            this.audioContext
            this.soundBufferMap = {}

            this.initAudio()
        },

        initAudio: function() {
            var that = this

            function createAudioContext() {
                var contextClass = (window.AudioContext ||
                        window.webkitAudioContext ||
                        window.mozAudioContext ||
                        window.oAudioContext);
                if (contextClass) {
                    return new contextClass();
                } else {
                    alert("Sorry. WebAudio API not supported. Try using the Google Chrome or Safari browser.");
                    return null;
                }
            }

            function fixOscillator(osc) {
                if (typeof osc.start == 'undefined') {
                    osc.start = function(when) {
                        osc.noteOn(when);
                    }
                }
                if (typeof osc.stop == 'undefined') {
                    osc.stop = function(when) {
                        osc.noteOff(when);
                    }
                }
            }

            that.audioContext = createAudioContext()
            if( that.audioContext )
            {
                that.oscillator = that.audioContext.createOscillator();
                fixOscillator(that.oscillator);
                that.oscillator.frequency.value = 440;
                that.oscillator.type = 'triangle'
                that.amp = that.audioContext.createGain();
                that.amp.gain.value = 0;

                // Connect ooscillator to amp and amp to the mixer of the audioContext.
                // This is like connecting cables between jacks on a modular synth.
                that.oscillator.connect(that.amp);
                that.amp.connect(that.audioContext.destination);
                that.oscillator.start(0);
                //writeMessageToID( "soundStatus", "<p>Audio initialized.</p>");
                console.log("Audio initialized.")
            }
        },

        loadSound: function(name, url) {
            var that = this
            if( that.audioContext )
            {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.send();
                request.onload = function() {
                    that.audioContext.decodeAudioData(request.response, function onSuccess(decodedBuffer) {
                        // Decoding was successful, do something useful with the audio buffer
                        that.soundBufferMap[name] = decodedBuffer
                        console.log("Sound loaded("+name+"): " + url)
                    }, function onFailure() {
                        alert("Decoding the audio buffer failed");
                    });
                };
            }

        },

        createMonoSound: function(name, data, samplerate) {
            // data should be an array of values between -1 and 1
            var that = this
            if( that.audioContext )
            {
                var buffer = that.audioContext.createBuffer(1, data.length, samplerate);

                var monoChannelData = buffer.getChannelData(0);

                if(monoChannelData.length != data.length) {
                    console.log("Buffer data length error.")
                    return;
                }

                for(var i=0;i<monoChannelData.length;i++) {
                    monoChannelData[i] = data[i]
                }

                that.soundBufferMap[name] = buffer

                console.log("Sound created("+name+")")
            }

        },

        startTone: function(frequency) {
            var that = this
            var now = that.audioContext.currentTime;

            that.oscillator.frequency.setValueAtTime(frequency, now);

            // Ramp up the gain so we can hear the sound.
            // We can ramp smoothly to the desired value.
            // First we should cancel any previous scheduled events that might interfere.
            that.amp.gain.cancelScheduledValues(now);
            // Anchor beginning of ramp at current value.
            that.amp.gain.setValueAtTime(that.amp.gain.value, now);
            that.amp.gain.linearRampToValueAtTime(0.5, that.audioContext.currentTime + 0.1);

            //writeMessageToID( "soundStatus", "<p>Play tone at frequency = " + frequency  + "</p>");
            console.log("Play tone at frequency = " + frequency)
        },

        stopTone: function() {
            var that = this
            var now = that.audioContext.currentTime;
            that.amp.gain.cancelScheduledValues(now);
            that.amp.gain.setValueAtTime(that.amp.gain.value, now);
            that.amp.gain.linearRampToValueAtTime(0.0, that.audioContext.currentTime + 1.0);
            //writeMessageToID( "soundStatus", "<p>Stop tone.</p>");
            console.log("Stop tone")
        },

        playSound: function(name, rate, volume, quick) {
            var that = this
            if(that.soundBufferMap[name]) {
                var sound = that.audioContext.createBufferSource();
                var gain = that.audioContext.createGain();
                sound.buffer = that.soundBufferMap[name];
                sound.playbackRate.value = rate
                sound.connect(gain);
                gain.connect(that.audioContext.destination);

                gain.gain.value = volume;

                if(quick) {
                    sound.start(0., .2, .4);
                }
                else {
                    sound.start(0);
                }
            }
        }
    }

    audio._init()
    return audio
}

