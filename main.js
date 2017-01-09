const electron = require("electron")
const {app, BrowserWindow} = electron
const ipcMain = require('electron').ipcMain;
// const Config = require('electron-config');
// const config = new Config();

global.plan = 'work'
global.current_start_time = null
global.current_length = 25
global.current_key = null


var menubar = require('menubar')
var opts = {dir: __dirname}//var opts = {dir: __dirname, icon: path.join(__dirname, 'images', 'Icon.png')}
var mb = menubar(opts)

//https://github.com/maxogden/menubar
// mb.on('create-window', )
mb.on('ready', function ready () {
  console.log('app is ready')
  // console.log(mb)
  // mb.on('create-window', function create (){
  //   let win = new BrowserWindow({width:400, height:400})
  // })
  mb.on('after-create-window', function ha (){
    mb.window.openDevTools()
    mb.window.loadURL(`file://${__dirname}/index.html`)

    //window.webContents.openDevTools()
    // console.log(app.getPath('userData'))

    ipcMain.on('load-page', (event, arg) => {
        mb.window.loadURL(arg);
    });

    ipcMain.on('plan', (event, arg) => {
        global.plan = arg; //to show the plan in the timer
    });

    ipcMain.on('send-current-start-time', (event, arg) => {
        global.current_start_time = arg; //to update current_start_time
    });

    ipcMain.on('send-current-length', (event, arg) => {
        global.current_length = arg; //to update current_length
    });

    ipcMain.on('send-current-key', (event, arg) => {
        global.current_key = arg; //to update current_start_time
    });


  })

  // mb.window.loadUrl(`file://${__dirname}/index.html`)
  //
  // //window.webContents.openDevTools()
  // // console.log(app.getPath('userData'))
  //
  // ipcMain.on('load-page', (event, arg) => {
  //     mb.window.loadUrl(arg);
  // });
  //
  // ipcMain.on('plan', (event, arg) => {
  //     global.plan = arg; //to show the plan in the timer
  // });
})

// app.on('ready', () => {
//   let win = new BrowserWindow({width:600, height:600})
//
//   win.loadURL(`file://${__dirname}/index.html`)
//
//   win.webContents.openDevTools()
//   // console.log(app.getPath('userData'))
//
//   ipcMain.on('load-page', (event, arg) => {
//       win.loadURL(arg);
//   });
//
//   ipcMain.on('plan', (event, arg) => {
//       global.plan = arg; //to show the plan in the timer
//   });
//
//
// })

// exports.openWindow = ()=> {
//   let win = new BrowserWindow({width:200, height:200})
//   win.loadURL(`file://${__dirname}/bear.html`)
// }
