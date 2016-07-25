module.exports = process.versions.nsolid
  ? require('__nsolid_zmq')
  : require('./lib');
