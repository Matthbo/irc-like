/*Imports*/
const net = require('net'),
  util = require('util')

/*Constances*/
const HOST = '127.0.0.1',
  PORT = 6667

/*CommandLine handler*/
function sendCLRes(sender, ...data){
  process.stdout.write(util.format(`${sender}>`, ...data, '\n'))
}

function log(...data){
  sendCLRes('client', ...data)
}

/*Client*/
class Client {
  constructor(){
    this.socket = new net.Socket().connect(PORT, HOST)

    this.eventHandler()

    process.stdin.addListener("data", (d) => this.commandHandler(d))
  }

  commandHandler(data){
    const cmd = data.toString().trim();

    switch(cmd){
      case 'exit':
      case 'stop':
        this.stop()
        break
      default:
        log("Unkown command")
    }
  }

  eventHandler(){
    this.socket.on('connect', () => {
      log('Connected to', this.socket.address().address)
    })

    this.socket.on('error', (err) => {
      log('Connection error:', err.message)
    })

    this.socket.on('close', (had_error) => {
      if(!had_error) log('Connection to server closed')
      process.exit(0)
    })
  }

  stop(){
    this.socket.end()
  }

}

new Client()
