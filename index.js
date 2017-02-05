const ipc = require('electron').ipcRenderer;
var button_start = document.getElementById('start_button')
var button_record = document.getElementById('record_button')
var button_quit = document.getElementById('quit_button')
var txtbox = document.getElementById("plan");


const Config = require('electron-config');
const config = new Config();

button_quit.addEventListener('click', () => {
  ipc.send('quit', '');
});

button_start.addEventListener('click', () => {
  var txtbox = document.getElementById("plan");
  var plan = txtbox.value;
  var time_select = parseInt(document.getElementById('timeLength').value)

  ipc.send('plan-time-length',time_select);
  ipc.send('plan', plan);
  ipc.send('load-page', 'file://' + __dirname + '/timer.html');
}, false)

button_record.addEventListener('click', () => {
  ipc.send('load-record', 'file://' + __dirname + '/record.html'); //open a new window here
}, false)
