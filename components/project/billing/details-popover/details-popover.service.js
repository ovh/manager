

angular.module('managerApp')
  .service('DetailsPopoverService', function () {
    const self = this;

    self.reset = function () {
      self.setCurrentDetails(undefined);
    };

    self.getCurrentDetails = function () {
      return self.currentDetails;
    };

    self.setCurrentDetails = function (details) {
      self.currentDetails = details;
    };

    self.isCurrentDetails = function (details) {
      return self.currentDetails === details;
    };

    function init() {
      self.reset();
    }

    init();
  });
