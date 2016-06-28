var zmq = require('..')
  , should = require('should')
  , semver = require('semver');

describe('socket.monitor', function() {
  if (!zmq.ZMQ_CAN_MONITOR) {
    console.log("monitoring not enabled skipping test");
    return;
  }

  it('should be able to monitor the socket', function(done) {
    var rep = zmq.socket('rep')
      , req = zmq.socket('req')
      , events = [];

    rep.on('message', function(msg){
      msg.should.be.an.instanceof(Buffer);
      msg.toString().should.equal('hello');
      rep.send('world');
    });

    var testedEvents = ['listen', 'accept', 'disconnect'];
    testedEvents.forEach(function(e) {
      rep.on(e, function(event_value, event_endpoint_addr) {
        // Test the endpoint addr arg
        event_endpoint_addr.toString().should.equal('tcp://127.0.0.1:5423');

        // If this is a disconnect event we can now close the rep socket
        if (e === 'disconnect') {
          rep.close();
        }

        testedEvents.pop();
        if (testedEvents.length === 0) {
          rep.unmonitor();
          done();
        }
      });
    });

    // enable monitoring for this socket
    rep.monitor();

    rep.bind('tcp://127.0.0.1:5423', function (error) {
      if (error) throw error;
    });

    rep.on('bind', function(){
      req.connect('tcp://127.0.0.1:5423');
      req.send('hello');
      req.on('message', function(msg){
        msg.should.be.an.instanceof(Buffer);
        msg.toString().should.equal('world');
        req.close();
      });
    });
  });
});
