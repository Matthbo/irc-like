/*Imports*/
const net = require('net'),
  util = require('util'),
  { PacketHandler, TestPacket } = require('./packet')

/*Constances*/
const HOST = '::',
  PORT = 6667

/*CommandLine handler*/
function sendCLRes(sender, ...data){
  process.stdout.write(util.format(`${sender}>`, ...data, '\n'))
}

function log(...data){
  sendCLRes('server', ...data)
}

/*Client list*/
class ClientList {
  constructor(){
    this.clients = {}
  }

  add(socket){
    const id = Math.random().toString(36).substring(2)
    this.clients[id] = { id, socket }

    return id
  }

  remove(id){
    if(this.clients[id] != -1) delete this.clients[id]
  }

  get(id){
    return this.clients[id]
  }

  all(){
    return Object.values(this.clients)
  }
}

/*Server*/
class Server {
  constructor(){
    this.server = net.createServer()
    this.clientList = new ClientList()
    PacketHandler.registerPackets()

    this.eventHandler()

    process.stdin.addListener("data", (d) => this.commandHandler(d))
    process.on('SIGINT', () => this.stop() )
  }

  commandHandler(data){
    const cmd = data.toString().trim()

    switch(cmd){
      case 'clients':
        const clientsArr = []
        for(let client of this.clientList.all()){
          clientsArr.push({ id: client.id, ip: client.socket.remoteAddress })
        }
        log(clientsArr)
      case 'stop':
      case 'exit':
        this.stop()
        break
      default:
        log("Unkown command")
    }  
  }

  clientEventHandler(socket){
    socket.info = { id: this.clientList.add(socket), ip: socket.remoteAddress }
    const sender = `${socket.info.id}[${socket.info.ip}]`

    sendCLRes(sender, 'Connected')

    socket.on('error', (err) => {
      sendCLRes(sender, 'Connection error:', err.message)
    })

    socket.on('data', (data) => {
      const packet = new TestPacket().setBuffer(data)
       let res = ""
      packet.read(packet => {
        //res = packet.toString().replace(/\0/g, '')
        res = packet.readUInt8(0)
      })
      sendCLRes(sender, 'Sent', res)
    })

    socket.on('close', (had_error) => {
      this.clientList.remove(socket.info.id)

      if(!had_error){
        sendCLRes(sender, 'Closed the connection')
      }
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

    for(let client of this.clientList.all()){
      client.socket.end()
    }

    this.server.close()
  }
}

const server = new Server();
server.start()
