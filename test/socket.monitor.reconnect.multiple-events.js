var zmq = require('..')
  , should = require('should')
  , semver = require('semver');

describe('socket.monitor.reconnect multiple events', function() {
  if (!zmq.ZMQ_CAN_MONITOR) {
    console.log("monitoring not enabled skipping test");
    return;
  }

  it('should read multiple events on monitor interval', function(done) {
    var req = zmq.socket('req');
    req.setsockopt(zmq.ZMQ_RECONNECT_IVL, 5);
    var closeTime;
    req.on('close', function() {
      closeTime = Date.now();
    });

    req.on('connect_retry', function() {
      var diff = Date.now() - closeTime;
      req.unmonitor();
      req.close();
      diff.should.be.within(0, 500);
      done();
    });

    // This should read all available messages from the queue, and we expect that "close" and "connect_retry" will be
    // read on the same interval (for further details see the comment in the previous test)
    req.monitor(10, 0);
    req.connect('tcp://127.0.0.1:5423');
  });
})
