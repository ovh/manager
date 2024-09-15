import '@testing-library/jest-dom';

if (!Element.prototype.attachInternals) {
  Element.prototype.attachInternals = function() {
    return {};
  };
}
