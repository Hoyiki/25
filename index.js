// const remote = require('electron').remote
// const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;

//var button_start = document.createElement('button')
var button_start = document.getElementById('start_button')
var button_record = document.createElement('button')
var button_clear = document.createElement('button')

const NotificationCenter = require('node-notifier').NotificationCenter;
const Config = require('electron-config');
const config = new Config();

var notifier = new NotificationCenter({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative path if you want to use your fork of terminal-notifier
});

//button_start.textContent = 'start'
button_start.addEventListener('click', () => {
  var txtbox = document.getElementById("plan");
  var plan = txtbox.value;
  console.log(plan)
  //var length = document.getElementById("lengthInput").value

  //https://github.com/mikaelbr/node-notifier start working notification
  notifier.notify({
    'title': 'Start Working',
    'message': plan+' ',
    'sound': 'Submarine',
    'icon': 'file://' + __dirname + '/notification_icon.png',
    //'contentImage': 'file://' + __dirname + '/notification_icon.png'
  });
  //ipc.send('send-current-length', length);
  ipc.send('plan', plan);
  ipc.send('load-page', 'file://' + __dirname + '/timer.html');
}, false)

button_record.textContent = 'record'
button_record.addEventListener('click', () => {
  ipc.send('load-page', 'file://' + __dirname + '/record.html');
}, false)

//this button is only for developing stage
button_clear.textContent = 'clear'
button_clear.addEventListener('click', () => {
  config.clear();
}, false)

//document.body.appendChild(button_start)
document.body.appendChild(button_record)
document.body.appendChild(button_clear)
