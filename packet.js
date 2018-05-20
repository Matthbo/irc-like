class Packet {
  constructor(){
    this.packet = Buffer.alloc(this.size())
  }

  /* Packet byte size */
  size(){ return 16  }

  getBuffer() { return this.packet }

  setBuffer(buffer) {
    if(buffer instanceof Buffer && buffer.length == this.packet.length){
      this.packet = buffer
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

module.exports = {
  TestPacket
}
