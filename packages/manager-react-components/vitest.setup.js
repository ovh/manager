// vitest.setup.js
global.HTMLElement.prototype.attachInternals = function () {
  return {}; // Mock implementation or return a mock object if needed
};
