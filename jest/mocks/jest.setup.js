const fetchPolyfill = require('whatwg-fetch');

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;
global.console = {
  ...console,
  // console.error is just noise during test
  // A test that fails will tell u why
  // Console.error is often used by other libraries
  // and we do not have the control over that
  // In test environement, it adds nothing to keep them
  error: jest.fn(),
};
