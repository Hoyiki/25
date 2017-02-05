const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote
let plan = remote.getGlobal('plan')
let length = remote.getGlobal('current_length')
let plan_length =  0.1//parseInt(remote.getGlobal('plan_time_length'))

const notifier = require('node-notifier').NotificationCenter;

var notifier_start = new notifier({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative path if you want to use your fork of terminal-notifier
});

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
  var timeinterval = setInterval(function(){
    var t = getTimeRemaining(endtime);
    console.log(t.total)
    if(t.total<=0){
      clearInterval(timeinterval);

      ipc.send('whether-notifying',true);
      ipc.send('load-page', 'file://' + __dirname + '/reflection.html');
    }
  },1000);
}


//database https://github.com/sindresorhus/electron-config
let d = new Date()
let start_time_key = d.toJSON().slice(0,-5); //key of the current node, can be converted back to date https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toJSON


//button to stop the timer and go to the input page
var button = document.getElementById('stop_button')
var button_quit = document.getElementById('quit_button')

button_quit.addEventListener('click', () => {
  ipc.send('quit', '');
});

button.addEventListener('click', () => {
  ipc.send('whether-notifying',false);
  ipc.send('load-page', 'file://' + __dirname + '/reflection.html');
}, false)

var plandiv = document.getElementById('plandiv')
plandiv.innerHTML = plan

ipc.send('send-current-start-time', d);
ipc.send('send-current-key', start_time_key);

d.setMinutes(d.getMinutes() + Number(plan_length)); //total length of the time
initializeClock('clockdiv', d, plan);

(function drawCanvas(){
  var canvas=document.getElementById('mycanvas');
  var ctx=canvas.getContext('2d');
  var cWidth=canvas.width;
  var cHeight=canvas.height;

  var countTo=plan_length*60; //this is where to set time for the timer

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

    var textColor='#b99668';
    var textSize="12";
    var fontFace="helvetica, arial, sans-serif";

    ctx.fillStyle=textColor;
    ctx.font=textSize+"px "+fontFace;
    ctx.fillText('MIN',cWidth/2-46,cHeight/2-25);
    ctx.fillText('SEC',cWidth/2+25,cHeight/2-15);

    ctx.fillStyle='#6292ae';

    ctx.font='62px '+fontFace;
    ctx.fillText(min ,cWidth/2-60,cHeight/2+35);

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
