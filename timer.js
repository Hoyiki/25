function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000) / 60 );
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime, plan){
  var clock = document.getElementById(id);
  var timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    clock.textContent = 'minutes: ' + t.minutes  +
                      '     seconds: ' + t.seconds;
    if(t.total<=0){
      clearInterval(timeinterval);
      notifier.notify({
        'title': 'Time is up',
        'message': plan,
        'sound': 'Glass'
      });
      ipc.send('load-page', 'file://' + __dirname + '/reflection.html');
    }
  },1000);
}

const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote
let plan = remote.getGlobal('plan')
let length = remote.getGlobal('current_length')
const Config = require('electron-config');
const config = new Config();
const NotificationCenter = require('node-notifier').NotificationCenter;

var notifier = new NotificationCenter({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative path if you want to use your fork of terminal-notifier
});

//database https://github.com/sindresorhus/electron-config
let d = new Date()
let start_time_key = d.toJSON().slice(0,-5); //key of the current node, can be converted back to date https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON
config.set(start_time_key+'.plan', plan);

//button to stop the timer and go to the input page
var button = document.getElementById('stop_button')
//button.textContent = 'stop'
button.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/reflection.html');
}, false)
//document.body.appendChild(button)

var plandiv = document.getElementById('plandiv')
plandiv.innerHTML = plan

ipc.send('send-current-start-time', d);
ipc.send('send-current-key', start_time_key);

d.setMinutes(d.getMinutes() + Number(length)); //total length of the time
initializeClock('clockdiv', d, plan);

(function drawCanvas(){
  var canvas=document.getElementById('mycanvas');
  var ctx=canvas.getContext('2d');
  var cWidth=canvas.width;
  var cHeight=canvas.height;

  var countTo=25*60; //this is where to set time for the timer

  var min=Math.floor(countTo/60);
  var sec=countTo-(min*60);
  var counter=0;
  var angle=270;
  var inc=360/countTo;


  function drawScreen() {



    //======= reset canvas

    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,cWidth,cHeight);

    //========== base arc

    ctx.beginPath();
    ctx.strokeStyle="#f6f2ed";
    ctx.lineWidth=14;
    ctx.arc(cWidth/2,cHeight/2,100,(Math.PI/180)*0,(Math.PI/180)*360,false);
    ctx.stroke();
    ctx.closePath();

    //========== dynamic arc

    ctx.beginPath();
    ctx.strokeStyle="#cfbfac";
    ctx.lineWidth=14;
    ctx.arc(cWidth/2,cHeight/2,100,(Math.PI/180)*270,(Math.PI/180)*angle,false);
    ctx.stroke();
    ctx.closePath();

    // //======== inner shadow arc
    //
    // // grad=ctx.createRadialGradient(cWidth/2,cHeight/2,80,cWidth/2,cHeight/2,115);
    // // grad.addColorStop(0.0,'rgba(0,0,0,.4)');
    // // grad.addColorStop(0.5,'rgba(0,0,0,0)');
    // // grad.addColorStop(1.0,'rgba(0,0,0,0.4)');
    //
    // ctx.beginPath();
    // ctx.strokeStyle="#f6f2ed";
    // ctx.lineWidth=14;
    // ctx.arc(cWidth/2,cHeight/2,100,(Math.PI/180)*0,(Math.PI/180)*360,false);
    // ctx.stroke();
    // ctx.closePath();

    //======== bevel arc

    // grad=ctx.createLinearGradient(cWidth/2,0,cWidth/2,cHeight);
    // grad.addColorStop(0.0,'#6c6f72');
    // grad.addColorStop(0.5,'#252424');

    // ctx.beginPath();
    // ctx.strokeStyle="#f6f2ed";
    // ctx.lineWidth=1;
    // ctx.arc(cWidth/2,cHeight/2,93,(Math.PI/180)*0,(Math.PI/180)*360,true);
    // ctx.stroke();
    // ctx.closePath();

    // //====== emboss arc
    //
    // // grad=ctx.createLinearGradient(cWidth/2,0,cWidth/2,cHeight);
    // // grad.addColorStop(0.0,'transparent');
    // // grad.addColorStop(0.98,'#6c6f72');
    //
    // ctx.beginPath();
    // ctx.strokeStyle="#f6f2ed";
    // ctx.lineWidth=1;
    // ctx.arc(cWidth/2,cHeight/2,107,(Math.PI/180)*0,(Math.PI/180)*360,true);
    // ctx.stroke();
    // ctx.closePath();

    //====== Labels

    var textColor='#b99668';
    var textSize="12";
    var fontFace="helvetica, arial, sans-serif";

    ctx.fillStyle=textColor;
    ctx.font=textSize+"px "+fontFace;
    ctx.fillText('MIN',cWidth/2-46,cHeight/2-25);
    ctx.fillText('SEC',cWidth/2+25,cHeight/2-15);

    //====== Values



    ctx.fillStyle='#6292ae';

    ctx.font='62px '+fontFace;
    ctx.fillText(min ,cWidth/2-60,cHeight/2+35);

//     if (min>9) {
//       ctx.font='84px '+fontFace;
//       ctx.fillText('9' ,cWidth/2-55,cHeight/2+35);

//       ctx.font='24px '+fontFace;
//       ctx.fillText('+' ,cWidth/2-72,cHeight/2-5);
//     }
//     else {
//       ctx.font='84px '+fontFace;
//       ctx.fillText(min ,cWidth/2-60,cHeight/2+35);
//     }

    ctx.font='46px '+fontFace;
    if (sec<10) {
      ctx.fillText('0'+sec,cWidth/2+10,cHeight/2+35);
    }
    else {
      ctx.fillText(sec,cWidth/2+10,cHeight/2+35);
    }


    if (sec<=0 && counter<countTo) {
      angle+=inc;
      counter++;
      min--;
      sec=59;
    } else
      if (counter>=countTo) {
        sec=0;
        min=0;
      } else {
        angle+=inc;
        counter++;
        sec--;
      }
  }

  setInterval(drawScreen,1000);

})()
