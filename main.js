const electron = require("electron")
const {app, BrowserWindow} = electron
const ipcMain = require('electron').ipcMain;

global.plan = null
global.current_start_time = null
global.current_length = 25
global.current_key = null
global.plan_time_length = 25
global.whether_notifying = false


var menubar = require('menubar')
var opts = {dir: __dirname, height:250}//var opts = {dir: __dirname, icon: path.join(__dirname, 'images', 'Icon.png')}
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

    ipcMain.on('load-record', (event, arg) => {
        let win = new BrowserWindow({width:800, height:600})
        win.loadURL(arg);
        win.webContents.openDevTools()
    });

    ipcMain.on('plan', (event, arg) => {
        global.plan = arg; //to show the plan in the timer
    });

    ipcMain.on('send-current-start-time', (event, arg) => {
        global.current_start_time = arg; //to update current_start_time
    });

    ipcMain.on('plan-time-length', (event, arg) => {
        global.plan_time_length = arg; //to use this value in the timer
    });

    ipcMain.on('send-current-length', (event, arg) => {
        global.current_length = arg; //to update current_length
    });

    ipcMain.on('send-current-key', (event, arg) => {
        global.current_key = arg; //to update current_start_time
    });

    ipcMain.on('quit', (event, arg) => {
        app.quit();
    });

    ipcMain.on('whether-notifying', (event, arg) => {
        global.whether_notifying = arg;
    });


  })
})
