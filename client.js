/*Imports*/
const net = require('net'),
  util = require('util')

/*Constances*/
const HOST = '192.168.16.120',
  PORT = 1337

/*CommandLine handler*/
function sendCLRes(sender, ...data){
  process.stdout.write(util.format(`${sender}>`, ...data, '\n'))
}

function log(...data){
  sendCLRes('client', ...data)
}

process.stdin.addListener("data", function(d) {
  cmd = d.toString().trim();

  switch(cmd){
    default:
      log("Unkown command")
  }      
})

/*Socket*/
const socket = new net.Socket().connect(PORT, HOST);

socket.on('connect', () => {
  log('Connected to', socket.remoteAddress())
})
