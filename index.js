const express 	= require('express')
const app 		= express()
const http 		= require('http')
const server 	= http.createServer(app)

const io = require('socket.io')(server)

io.on('connection', (socket) => {

  nbr_user = io.engine.clientsCount ;

  console.log('on cherche',nbr_user)

  console.log('a user connected')
  console.log('nbr connected : ', io.engine.clientsCount)

  io.emit('usercount', io.engine.clientsCount)

  socket.on('disconnect', () => {
    console.log('user disconnected')
    console.log('nbr connected : ', io.engine.clientsCount)

    io.emit('usercount', io.engine.clientsCount)

  })

  // socket.on('start', (msg) => {
    
  // });

})


app.use(express.static('public'))

server.listen(3000, () => {
	console.log('listening on *:3000')
})