/*Imports*/
const net = require('net'),
  util = require('util');

/*Constances*/
const HOST = '::',
  PORT = 1337

/*CommandLine handler*/
function sendCLRes(sender, ...data){
  process.stdout.write(util.format(`${sender}>`, ...data, '\n'))
}

function log(...data){
  sendCLRes('server', ...data)
}

process.stdin.addListener("data", function(d) {
  cmd = d.toString().trim();

  switch(cmd){
    case 'address':
      log(seserver.address())
      break;
    case 'stop':
    case 'exit':
      stop()
      break;
    default:
      log("Unkown command")
  }      
})

/*Server*/
const server = net.createServer()

server.on('connection', (socket) => {
  socket.info = { ip: socket.remoteAddress }

  sendCLRes(socket.info.ip, 'has connected')

  socket.on('error', (err) => {
    sendCLRes(socket.info.ip, 'Connection error:', err.message)
  })

  socket.on('close', () => {
    sendCLRes(socket.info.ip, 'has closed the connection')
  })
})

server.on('error', (err) => {
  log(`Critical server error:\n${err}`)
})

server.on('close', () => {
  process.exit(0)
})

server.listen(PORT, HOST, () => {
  log("Listening on", server.address())
})

function stop(){
  log('Closing server')

  server.close()
}