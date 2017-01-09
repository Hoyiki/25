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
    clock.textContent = 'minutes: ' + t.minutes  +
                      '     seconds: ' + t.seconds;
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

var button = document.createElement('button')
button.textContent = 'submit'
button.addEventListener('click', () => {
  // main.openWindow()
  ipc.send('load-page', 'file://' + __dirname + '/index.html');
  let reflection = document.getElementById('reflection').value
  config.set(current_key+'.reflection', reflection)
}, false)
document.body.appendChild(button)

updateClock("clockdiv", current_start_time)
