#!/bin/bash

cat ./gui/node.js \
./gui/nodeFactory.js \
./gui/edge.js  \
./gui/graph.js  \
./gui/events.js \
./gui/common.js > ../docs/javascripts/twip.js

sed -E 's/console.log\((.*)\);?//g' ../docs/javascripts/twip.js > ../docs/javascripts/twip.min.js

