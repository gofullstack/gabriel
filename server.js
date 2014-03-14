var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('send', function (data) {
    io.sockets.emit('message', data);
  });
});

exports.listen = function(port) {
  server.listen(port);
};
