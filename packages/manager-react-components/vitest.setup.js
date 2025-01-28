// vitest.setup.js
import '@testing-library/jest-dom';

global.HTMLElement.prototype.attachInternals = function () {
  return {}; // Return an empty object or mock the internals as needed
};
