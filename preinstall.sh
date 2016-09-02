#!/bin/sh

rm -rf deps/zmq &&                             \
npm install nan@~2.3 &&                        \
git clone git@github.com:nodesource/libzmq.git \
  --branch thlorenz/force-static               \
  --depth 1 --single-branch                    \
  deps/zmq &&                                  \
rm -rf deps/zmq/.git &&                        \
node-gyp configure &&                          \
node-gyp build
