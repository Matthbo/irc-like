class Packet {
  constructor(){
    this.packetId = Buffer.alloc(1, PacketHandler.getPacketId(this))
    this.packet = Buffer.alloc(this.size() - 1)
  }

  /* Packet byte size */
  size(){ return 16  }

  getBuffer() { return Buffer.concat([this.packetId, this.packet], this.size()) }

  setBuffer(buffer) {
    if(buffer instanceof Buffer && buffer.length == this.size()){
      this.packetId = buffer.slice(0, 1) 
      this.packet = buffer.slice(1)
    } else if(buffer instanceof Buffer){
      throw new Error("Buffer length is different, this is probably not the correct packet")
    } else {
      throw new Error("Cannot make packet of non buffer")
    }

    return this
  }
}

class TestPacket extends Packet {
  constructor(){
    super()
  }

  read(readFunc){
    readFunc(this.packet)
    return this
  }

  write(writeFunc){
    writeFunc(this.packet)
    return this
  }

  size(){ return 64 }
}

const PacketHandler = {}

PacketHandler.PACKETS_LIST = []

PacketHandler.registerPackets = () => {
  const packets = [
    TestPacket
  ]

  for (let packetId in packets){
    const packet = packets[packetId]
    if(packetId < 256) PacketHandler.PACKETS_LIST[packetId] = packet
    else console.error(`${packetId} is out of range for an U8Int`)
  }
}

PacketHandler.getPacketId = (packet) =>{
  return PacketHandler.PACKETS_LIST.findIndex(element => { return packet instanceof element })
}

module.exports = {
  PacketHandler,
  TestPacket
}
