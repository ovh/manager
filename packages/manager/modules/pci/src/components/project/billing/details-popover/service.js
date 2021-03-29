export default function () {
  const self = this;

  self.reset = function reset() {
    self.setCurrentDetails(undefined);
  };

  self.getCurrentDetails = function getCurrentDetails() {
    return self.currentDetails;
  };

  self.setCurrentDetails = function setCurrentDetails(details) {
    self.currentDetails = details;
  };

  self.isCurrentDetails = function isCurrentDetails(details) {
    return self.currentDetails === details;
  };

  function init() {
    self.reset();
  }

  init();
}
