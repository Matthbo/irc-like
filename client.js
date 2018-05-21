/*Imports*/
const net = require('net'),
  util = require('util'),
  { PacketHandler, TestPacket } = require('./packet')

/*Constances*/
const PORT = 6667

/*CommandLine handler*/
function sendCLRes(sender, ...data){
  process.stdout.write(util.format(`${sender}>`, ...data, '\n'))
}

function log(...data){
  sendCLRes('client', ...data)
}

/*Client*/
class Client {
  constructor(HOST){
    if(!HOST){
      log('Please provide an host address')
      process.exit(1)
    } else {
      this.socket = new net.Socket().connect(PORT, HOST)
      PacketHandler.registerPackets()

      this.eventHandler()

      process.stdin.addListener("data", (d) => this.commandHandler(d))
      process.on('SIGINT', () => this.stop())
    }
  }

  commandHandler(data){
    const cmd = data.toString().trim();

    switch(cmd){
      case 'exit':
      case 'stop':
        this.stop()
        break
      case 'test':
        this.test()
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

  test(){
    const test = new TestPacket().write(packet => {
      packet.writeUInt8(255, 0)
    }).getBuffer()
    this.socket.write(test)
  }

  stop(){
    this.socket.end()
  }

}

new Client(process.argv[2])
