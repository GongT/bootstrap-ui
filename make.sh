#!/bin/bash
echo -e "(function(window){\"use strict\";\n" > dist/bootstrap-ui.js
cat src/js/*.js | grep -v '"use strict";' >> dist/bootstrap-ui.js
echo -e "\n})(window);" >> dist/bootstrap-ui.js

yuicompressor --type js --line-break 200  dist/bootstrap-ui.js -o dist/bootstrap-ui.min.js

lessc --yui-compress src/less/main.less > dist/bootstrap-ui.min.css

lessc src/less/main.less > dist/bootstrap-ui.css
