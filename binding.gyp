{
  'targets': [
    {
      'target_name': 'zmq',
      'sources': [ 'binding.cc' ],
      'cflags!': ['-fno-exceptions'],
      'cflags_cc!': ['-fno-exceptions'],
      'include_dirs' : [
        "<!(node -e \"require('nan')\")",
        'deps/zmq/include/'
      ],
      'dependencies': [
        '<(module_root_dir)/deps/zmq/binding.gyp:libzmq'
      ]
      # dir relative to ./build dir
# "libraries": [ '<(module_root_dir)/deps/zmq/build/Release/zmq.a' ]
    }
  ]
}
