// const remote = require('electron').remote
// const main = remote.require('./main.js')
const ipc = require('electron').ipcRenderer;

//var button_start = document.createElement('button')
var button_start = document.getElementById('start_button')
var button_record = document.getElementById('record_button')
var button_clear = document.createElement('button')
var button_quit = document.getElementById('quit_button')
var txtbox = document.getElementById("plan");

// const notifier = require('node-notifier').NotificationCenter;

const Config = require('electron-config');
const config = new Config();

// var notifier_start = new notifier({
//   withFallback: false, // Use Growl Fallback if <= 10.8
//   customPath: void 0 // Relative path if you want to use your fork of terminal-notifier
// });

button_quit.addEventListener('click', () => {
  ipc.send('quit', '');
});

button_start.addEventListener('click', () => {
  var txtbox = document.getElementById("plan");
  var plan = txtbox.value;
  var time_select = parseInt(document.getElementById('timeLength').value)

  //https://github.com/mikaelbr/node-notifier start working notification
  // notifier_start.notify({
  //   'title': 'Yo',
  //   'message': "",
  //   'sound': 'Submarine',
  //   'icon': 'file://' + __dirname + '/whale.png',
  //   'contentImage': 'file://' + __dirname + '/whale.png'
  // });
  //ipc.send('send-current-length', length);
  ipc.send('plan-time-length',time_select);
  ipc.send('plan', plan);
  ipc.send('load-page', 'file://' + __dirname + '/timer.html');
}, false)

button_record.addEventListener('click', () => {
  ipc.send('load-record', 'file://' + __dirname + '/record.html'); //open a new window here
}, false)

//this button is only for developing stage
button_clear.textContent = 'clear'
button_clear.addEventListener('click', () => {
  config.clear();
}, false)

//document.body.appendChild(button_start)
//document.body.appendChild(button_clear) //the button is only for the development stage
