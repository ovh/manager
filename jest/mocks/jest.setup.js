const fetchPolyfill = require('whatwg-fetch');
const { TextDecoder, TextEncoder } = require('node:util');
const { Blob, File } = require('node:buffer');

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;
global.Blob = Blob;
global.File = File;
