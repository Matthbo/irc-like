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

/*Server*/
class Server {

  constructor(){
    this.server = net.createServer()

    this.eventHandler()

    process.stdin.addListener("data", (d) => this.handleCommands(d))
  }

  handleCommands(data){
    const cmd = data.toString().trim()

    switch(cmd){
      case 'address':
        log(this.server.address())
        break;
      case 'stop':
      case 'exit':
        this.stop()
        break;
      default:
        log("Unkown command")
    }  
  }

  clientEventHandler(socket){
    socket.info = { ip: socket.remoteAddress }

    sendCLRes(socket.info.ip, 'Has connected')

    socket.on('error', (err) => {
      sendCLRes(socket.info.ip, 'Connection error:', err.message)
    })

    socket.on('close', () => {
      sendCLRes(socket.info.ip, 'Has closed the connection')
    })
  }

  eventHandler(){
    this.server.on('connection', (socket) => this.clientEventHandler(socket))

    this.server.on('error', (err) => {
      log(`Critical server error:\n${err}`)
    })

    this.server.on('close', () => {
      process.exit(0)
    })
  }

  start(){
    this.server.listen(PORT, HOST, () => {
      log("Listening on", this.server.address())
    })
  }

  stop(){
    log('Closing server')

    this.server.close()
  }
}

const server = new Server();
server.start()