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
  },1000);
}

const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote
const Config = require('electron-config');
const config = new Config();

let current_start_time = remote.getGlobal('current_start_time')
let current_key = remote.getGlobal('current_key')
let plan = remote.getGlobal('plan')

document.getElementById('reflection').value = plan

var button = document.getElementById('summit_button')
button.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/index.html');
  let reflection = document.getElementById('reflection').value
  config.set(current_key+'.reflection', reflection)
}, false)

updateClock("clockdiv", current_start_time)
