/* global qrcode, document*/
// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;

var timers = [];

function initCanvas(w,h,canvas)
{
    gCanvas = document.getElementById("qr-canvas")
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}

function captureToCanvas() {
    if(stype!==1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                timers.push(setTimeout(captureToCanvas, 500));
            };
        }
        catch(e){       
          timers.push(setTimeout(captureToCanvas, 500));
        };
    }
}

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
  try {
    if (webkit)
      v.src = window.URL.createObjectURL(stream);
    else if (moz) {
      v.mozSrcObject = stream;
      v.play();
    }
    else
      v.src = stream;
    gUM = true;
    timers.push(setTimeout(captureToCanvas, 500));
  } catch (e) {
  }
}
function error(error) {
    gUM=false;
    return;
}

// function load(cb)
function load(cb, canvas, video)
{
  stype=0;
  if(cb===null) {
    for(let i=0;i<timers.length;i++) {
      clearTimeout(timers[i]);
    }
    gCtx = null;
    gCanvas = null;
    stype=0;
    gUM=false;
    webkit=false;
    moz=false;
    v=null;
  } else if(isCanvasSupported() && window.File && window.FileReader)
	{
		initCanvas(800, 600, canvas);
		qrcode.callback = cb;
    setwebcam(video);
	}
}
function setwebcam(video)
{
	var options = true;
  if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
	{
    try{
      navigator.mediaDevices.enumerateDevices()
        .then(function (deviceInfos) {
          for (let i = 0; i !== deviceInfos.length; ++i) {
            var deviceInfo = deviceInfos[i];
            if (deviceInfo.kind === 'videoinput') {
              let label = deviceInfo.label || 'camera ' +
                (i + 1);
              if(label.toLowerCase().search("back") >-1) {
                options = {'deviceId': {'exact':deviceInfo.deviceId}, 'facingMode':'environment'}
                // options = {'sourceId': {'exact': device.deviceId}};
              }

            } else {
            }
          }
          setwebcam2(options, video);
        });
		}
		catch(e)
		{
		}
	}
	else{
		console.log("no navigator.mediaDevices.enumerateDevices" );
		setwebcam2(options, video);
	}
	
}

function setwebcam2(options, video)
{
    if(stype===1)
    {
      timers.push(setTimeout(captureToCanvas, 500));
        return;
    }
    var n=navigator;
    v=document.getElementById("v");
    if(n.getUserMedia)
	{
		webkit=true;
        n.getUserMedia({video: options, audio: false}, success, error);
	}
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }
    else
    if(n.mozGetUserMedia)
    {
        moz=true;
        n.mozGetUserMedia({video: options, audio: false}, success, error);
    }

    stype=1;
  timers.push(setTimeout(captureToCanvas, 500));
}

export default load;
