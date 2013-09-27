#!/bin/bash
lessc src/less/main.less > dist/bootstrap-ui.css

echo -e "(function($){\"use strict\";\n" > dist/bootstrap-ui.js
cat src/js/*.js | grep -v '"use strict";' >> dist/bootstrap-ui.js
echo -e "\n})(window.jQuery||jQuery);" >> dist/bootstrap-ui.js
