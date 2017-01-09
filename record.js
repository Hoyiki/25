const Config = require('electron-config');
const config = new Config();
const ipc = require('electron').ipcRenderer;
const dotProp = require('dot-prop'); //https://github.com/sindresorhus/dot-prop

var button_index = document.createElement('button')
button_index.textContent = 'Back'
button_index.addEventListener('click', () => {
  ipc.send('load-page', 'file://' + __dirname + '/index.html');
}, false)
document.body.appendChild(button_index)

for (let [key, value] of config) {
  console.log((new Date(key)).toLocaleString())

  console.log(value);
  var node = document.createElement("LI");
  let a = config.get(key)
  console.log(dotProp.get(value, 'plan'))
  console.log(dotProp.get(value, 'reflection'))
  console.log(dotProp.get(value, 'actualLength'))
  var textnode = document.createTextNode(key + "  " + dotProp.get(value, 'plan') + dotProp.get(value, 'reflection') + dotProp.get(value, 'actualLength'));
  node.appendChild(textnode);
  document.getElementById("recordList").appendChild(node);
}
