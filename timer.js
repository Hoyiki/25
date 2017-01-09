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
console.log(start_time_key)
config.set(start_time_key+'.plan', plan);

//button to stop the timer and go to the input page
var button = document.createElement('button')
button.textContent = 'stop'
button.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/reflection.html');
}, false)
document.body.appendChild(button)

var plandiv = document.getElementById('plandiv')
plandiv.innerHTML = plan

ipc.send('send-current-start-time', d);
ipc.send('send-current-key', start_time_key);

d.setMinutes(d.getMinutes() + Number(length)); //total length of the time
initializeClock('clockdiv', d, plan);
