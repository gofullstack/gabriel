var Gabriel = function() {
  this.app = require('express')();
  this.httpServer = require('http').createServer(this.app);
  this.io = require('socket.io').listen(this.httpServer);

  //
  // Setup socket.io events.
  //
  this.io.sockets.on('connection', function(socket) {
    // Listen for the event send:message which receives a message
    // object get the current romm of the socket which emmited the
    // send:message event and broadcast the message object that same
    // room.
    socket.on('send:message', function(data) {
      socket.get('currentRoom', function(err, room) {
        if(!err) {
          socket.broadcast.to(room).emit('sent:message', data);
        }
      });
    });

    //
    // Listen for the event join:room which recieves a room
    // object then set that room as an attribute on the current socket.
    //
    socket.on('join:room', function(data) {
      socket.join(data.room, function(err) {
        if(!err) {
          socket.set('currentRoom', data.room);
        }
      });
    });
  });

  //
  // Starts up the HTTP server on a given port.
  //
  this.start = function(port) {
    this.httpServer.listen(port);
  }

  //
  // Stops the HTTP server and closes all open sockets.
  //
  this.stop = function() {
    this.httpServer.close();

    this.io.sockets.clients().forEach(function(socket) {
      socket.disconnect();
    });
  }
}

module.exports = new Gabriel();
