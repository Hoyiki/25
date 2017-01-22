function nextDay (day) { //day needs to be in the format of 2017-01-21
  var d = new Date(day)
  d.setDate(d.getDate()+1)
  return (d.toJSON().substring(0,10))
}

function checkDayInArray (day, date_array) {
  for (i=0; i<date_array.length; i++){
    if (day == date_array[i][0]){
      return true
    }
  }
  return false
}

function findDay (day, date_array){ //this would return a list like [2017-12-19,[key,value],[key,value]...]
  for (i=0; i<date_array.length; i++){
    if (date_array[i][0]==day){
      return date_array[i]
    }
  }
  return [day]
}

function getTotalLength (dayList){ //[2017-12-19,[key,value],[key,value]...]
  let length = 0
  for (i=1; i<dayList.length; i++){
    let value = dayList[i][1]
    let time = Math.round(dotProp.get(value, 'actualLength'))
    length += time
  }
  return length
}

function generateOneRecordDiv ([key, value]){
  let divRow = document.createElement("div")
  divRow.classList.add("row")
  let div1 = document.createElement("div")
  let div2 = document.createElement("div")
  let div3 = document.createElement("div")
  let div4 = document.createElement("div")
  let div5 = document.createElement("div")
  div1.classList.add("col-xs-1","col-md-1","col-lg-1")
  div2.classList.add("col-xs-2","col-md-2","col-lg-1","recordFont")
  div3.classList.add("col-xs-6","col-md-6","col-lg-6","recordFont")
  div4.classList.add("col-xs-1","col-md-1","col-lg-1")
  div5.classList.add("col-xs-2","col-md-2","col-lg-2","recordFont")

  let time = new Date(key)
  div1.innerHTML = time.toLocaleTimeString()
  div3.innerHTML = dotProp.get(value, 'reflection')
  div5.innerHTML = Math.round(dotProp.get(value, 'actualLength'))

  for (i=1; i<=5; i++){
    divRow.appendChild("div"+i.toString())
  }
  return divRow
}

const Config = require('electron-config');
const config = new Config();
const ipc = require('electron').ipcRenderer;
const dotProp = require('dot-prop'); //https://github.com/sindresorhus/dot-prop

let date_array = [] //list structure: [[12/19/2012, [key, value], [key, value],[],...],[],...] put everything that belongs to the same date together

for (let [key, value] of config) {
  var day = key.substring(0,10) //day will be in the format of 2012-12-19
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

var myCalendar = new dhtmlXCalendarObject("box");
let lastDay = date_array[date_array.length-1][0]
let firstDay = date_array[0][0]
console.log(firstDay)
console.log(lastDay)
myCalendar.setSensitiveRange(firstDay,lastDay)

let keepChecking = true
let d = nextDay(firstDay)
while (keepChecking) {
  inSensi = false
  if (checkDayInArray(d, date_array)==false){
    myCalendar.setInsensitiveDays(d)
  }
  if (d==lastDay){
    keepChecking = false
  }
  d = nextDay(d)
  console.log(d)
}

myCalendar.show();

let divHead = document.getElementById('divHead')
let divDate = document.getElementById('divDate')
let divDayLength = document.getElementById('divDayLength')
var yo = myCalendar.attachEvent("onClick", function(){
  var d = myCalendar.getDate(true);
  divDate.innerHTML = d
  let dayList = findDay(d, date_array)
  let length = getTotalLength(dayList)
  divDayLength.innerHTML = length+' min'

  var recordDiv = document.createElement('div')

});



//dotProp.get(value, 'plan') + dotProp.get(value, 'reflection') + dotProp.get(value, 'actualLength'));
