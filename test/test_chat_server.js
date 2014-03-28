var assert = require('assert'),
    gabriel = require('../src/gabriel'),
    sinon = require('sinon'),
    io = require('socket.io-client');

var socketUrl = 'http://localhost:5000',
    socketOptions = { 'force new connection': true };

describe('chat server', function() {
  beforeEach(function() {
    gabriel.start(5000);
  });

  afterEach(function() {
    gabriel.stop();
  });

  it('should broadcast messages to all clients in a room', function(done) {
    var client1 = io.connect(socketUrl, socketOptions);
    var client2 = io.connect(socketUrl, socketOptions);

    client1.emit('join:room', { room: 'main' });
    client2.emit('join:room', { room: 'main' });

    setTimeout(function() {
      client1.emit('send:message', { message: 'hello world' });
    }, 500);

    client2.on('sent:message', function(data) {
      assert.equal(data.message, 'hello world');
      done();
    });
  });

  it("doesn't broadcast messages to clients not in the same room", function() {
    var client1 = io.connect(socketUrl, socketOptions);
    var client2 = io.connect(socketUrl, socketOptions);
    var client3 = io.connect(socketUrl, socketOptions);

    client1.emit('join:room', { room: 'main' });
    client2.emit('join:room', { room: 'main' });
    client3.emit('join:room', { room: 'project' });

    var client2Spy = sinon.spy();
    var client3Spy = sinon.spy();

    client2.on('sent:message', client2Spy);
    client3.on('sent:message', client3Spy);

    client1.emit('send:message', { message: 'hello world' });

    setTimeout(function() {
      assert(client2Spy.called);
      assert(client3Spy.notCalled);
    }, 500)
  });
});
