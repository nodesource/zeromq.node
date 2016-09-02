{
  'targets': [
    {
      'target_name': 'zmq',
      'sources': [ 'binding.cc' ],
      'cflags!': ['-fno-exceptions'],
      'cflags_cc!': ['-fno-exceptions'],
      'include_dirs' : [
        "<!(node -e \"require('nan')\")",
        './../zmq/include/'
      ],
      'dependencies': [
        './../zmq/zmq.gyp:libzmq'
      ]
    }
  ]
}
