/*********** Setup of video/webcam and checking for webGL support *********/

var videoReady = false;
var imagesReady = false;

// Triggers a button to be abled or disabled 
// untill webcam and webGL support is done check
function enablestart() {
    if (videoReady && imagesReady) {
        var startbutton = document.getElementById('startbutton');
        startbutton.value = "start";
        startbutton.disabled = null;
    }
}

$(window).load(function() {
    enablestart();
});

// Insert pre-install video if the web cam is not working.
var insertAltVideo = function(video) {
    if (supports_video()) {
        if (supports_webm_video()) {
            video.src = "./media/cap13_edit2.webm";
        } else if (supports_h264_baseline_video()) {
            video.src = "./media/cap13_edit2.mp4";
        } else {
            return false;
        }
        fd.init(webgl_overlay);
        fd2.init(webgl_overlay2);
        return true;
    } else return false;
}

function adjustVideoProportions() {
    // resize overlay and video if proportions are not 4:3
    // keep same height, just change width
    var proportion = vid.videoWidth/vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    overlay.width = vid_width;
    webgl_overlay.width = vid_width;
    webgl_overlay2.width = vid_width;
    newcanvas.width = vid_width;
    videocanvas.width = vid_width;
    maskcanvas.width = vid_width;
    webGLContext.viewport(0,0,webGLContext.canvas.width,webGLContext.canvas.height);
    webGLContext2.viewport(0,0,webGLContext2.canvas.width,webGLContext2.canvas.height);
}

// check whether browser supports webGL
var webGLContext;
var webGLContext2;
if (window.WebGLRenderingContext) {
    webGLContext = webgl_overlay.getContext('webgl') || webgl_overlay.getContext('experimental-webgl');
    webGLContext2 = webgl_overlay2.getContext('webgl') || webgl_overlay2.getContext('experimental-webgl');
    if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
        webGLContext = null;
    }
}
if (webGLContext == null) {
    alert("Your browser does not seem to support WebGL. Unfortunately this face mask example depends on WebGL, so you'll have to try it in another browser. :(");
}

// Check and load camera is it is successfully loads.
function gumSuccess( stream ) {
    // add camera stream if getUserMedia succeeded
    if ("srcObject" in vid) {
        vid.srcObject = stream;
    } else {
        vid.src = (window.URL && window.URL.createObjectURL(stream));
    }
    vid.onloadedmetadata = function() {
        adjustVideoProportions();
        fd.init(webgl_overlay);
        fd2.init(webgl_overlay2);
        vid.play();
    }
    vid.onresize = function() {
        adjustVideoProportions();
        fd.init(webgl_overlay);
        fd2.init(webgl_overlay2);
        if (trackingStarted) {
            ctrack.stop();
            ctrack.reset();
            ctrack.start(vid);
        }
        cancelRequestAnimFrame(detectionRequest);
        cancelRequestAnimFrame(animationRequest);
        overlayCC.clearRect(0, 0, vid_width, vid_height);
        drawGridLoop();
    }
}


// If the web cam is not present, (checks for camera support)
// it loads a saved pre-installed video.
function gumFail() {
    // fall back to video if getUserMedia failed
    insertAltVideo(vid);
    alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL

// check for camerasupport
if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
} else if (navigator.getUserMedia) {
    navigator.getUserMedia({video : true}, gumSuccess, gumFail);
} else {
    insertAltVideo(vid);
    alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}

vid.addEventListener('canplay', function() {videoReady = true;enablestart();}, false);
