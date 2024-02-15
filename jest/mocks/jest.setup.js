// PATCH for ODS Component to fix Error: Uncaught [TypeError: _this2.attachInternals is not a function]
import 'element-internals-polyfill';

require('@testing-library/jest-dom');

const fetchPolyfill = require('whatwg-fetch');

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;
