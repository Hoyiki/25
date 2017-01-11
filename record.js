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

let date_array = [] //list structure: [[12/19/2012, [key, value], [key, value],[],...],[],...] put everything that belongs to the same date together
//date format: date.toLocaleDateString('en-US')


for (let [key, value] of config) {

  //var node = document.createElement("LI");
  //var textnode = document.createTextNode(key + "  " + dotProp.get(value, 'plan') + dotProp.get(value, 'reflection') + dotProp.get(value, 'actualLength'));
  //node.appendChild(textnode);
  //document.getElementById("recordList").appendChild(node);

  var date = new Date(key)
  var day = date.toLocaleDateString('en-US')
  let l = date_array.length
  if (l == 0){
    date_array.push([day]);
    date_array[0].push([key,value]);
  }
  else if (day == date_array[l-1][0]) {
    date_array[l-1].push([key,value]);
  }
  else {
    date_array.push([day]);
    date_array[l].push([key,value]);
  }
}

console.log(date_array)

for (let i = date_array.length - 1; i >= 0; i--){
  let n = date_array[i]
  let day = n[0]
  console.log("-----"+day+"-----")
  var day_node = document.createElement("UL");
  for (let a = 1; a <= n.length-1; a++){
    [key, value] = n[a]
    var time_node = document.createElement("LI");
    var textnode = document.createTextNode(key + "  " + dotProp.get(value, 'plan') + dotProp.get(value, 'reflection') + dotProp.get(value, 'actualLength'));
    console.log(textnode)
    time_node.appendChild(textnode)
    day_node.appendChild(time_node)
  }
  document.getElementById("recordList").appendChild(day_node);
}
