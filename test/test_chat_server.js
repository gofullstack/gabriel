var assert = require('assert'),
    server = require('../server');
    io = require('socket.io-client');

var socketUrl = 'http://localhost:5000',
    socketOptions = { 'force new connection': true };

describe('chat server', function() {
  before(function() {
    server.listen(5000);
  });

  it('should broadcast messages to all clients', function(done) {
    var client1 = io.connect(socketUrl, socketOptions);
    var client2 = io.connect(socketUrl, socketOptions);

    client1.emit('send', { message: 'hello world' });

    client2.on('message', function(data) {
      assert.equal(data.message, 'hello world');
      done();
    });
  });
});
