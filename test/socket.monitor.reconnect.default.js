var zmq = require('..')
  , should = require('should')
  , semver = require('semver');

describe('socket.monitor.reconnect default interval', function() {
  if (!zmq.ZMQ_CAN_MONITOR) {
    console.log("monitoring not enabled skipping test");
    return;
  }

  it('should use default interval and numOfEvents', function(done) {
    var req = zmq.socket('req');
    req.setsockopt(zmq.ZMQ_RECONNECT_IVL, 5); // We want a quick connect retry from zmq

    // We will try to connect to a non-existing server, zmq will issue events: "connect_retry", "close", "connect_retry"
    // The connect_retry will be issued immediately after the close event, so we will measure the time between the close
    // event and connect_retry event, those should >= 10 .. not always true (changed to 5) .. (this will tell us that we are reading 1 event at a time from
    // the monitor socket).

    var closeTime;
    req.on('close', function() {
	    closeTime = Date.now();
    });

    req.on('connect_retry', function() {
      var diff = Date.now() - closeTime;
      req.unmonitor();
      req.close();
      diff.should.be.within(5, 500);
      done();
    });

    req.monitor();
    req.connect('tcp://127.0.0.1:5423');
  });
})
