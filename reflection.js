function getTimePassed(current_start_time){
  var t = Date.parse(new Date()) - Date.parse(current_start_time);
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000) / 60 );
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function updateClock(id, current_start_time){
  var clock = document.getElementById(id);
  var timeinterval = setInterval(function(){
    var t = getTimePassed(current_start_time);
    clock.textContent =t.minutes;
    button.onclick = function (){
      clearInterval(timeinterval);
      config.set(current_key+'.actualLength', t.minutes+(t.seconds)/60)
    }
    button_delete.onclick = function (){
      clearInterval(timeinterval);
    }
  },1000);
}

const notifier = require('node-notifier').NotificationCenter;

var notifier_start = new notifier({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative path if you want to use your fork of terminal-notifier
});

const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote
const Config = require('electron-config');
const config = new Config();

let noti = remote.getGlobal('whether_notifying')
let time = remote.getGlobal('plan_time_length')
let current_start_time = remote.getGlobal('current_start_time')
let current_key = remote.getGlobal('current_key')
let plan = remote.getGlobal('plan')
// notifier_start.notify({
//   'title': 'Worked for '+time+' minutes',
//   'message':'lalala',
//   'sound': 'Submarine',
//   // 'icon': 'file://' + __dirname + '/notification_icon.png',
//   //'contentImage': 'file://' + __dirname + '/notification_icon.png'
// });

console.log(noti)
if (noti==true) {
  notifier_start.notify({
    'title': 'Worked for '+time+' minutes',
    'message':plan+' ',
    'sound': 'Submarine',
    // 'wait': true
     //timeout: 60
    //'icon': 'file://' + __dirname + '/whale.png',
    //'contentImage': 'file://' + __dirname + '/whale.png'
  });
}

var button_quit = document.getElementById('quit_button')

button_quit.addEventListener('click', () => {
  ipc.send('quit', '');
});

document.getElementById('reflection').value = plan

var button = document.getElementById('summit_button')
button.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/index.html');
  let reflection = document.getElementById('reflection').value
  config.set(current_key+'.reflection', reflection)
}, false)

var button_delete = document.getElementById('delete_button')
button_delete.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/index.html');
}, false)

updateClock("clockdiv", current_start_time)
