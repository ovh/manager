angular.module('managerApp').service('RA.modalService', [
  '$rootScope',
  function RAModalService($rootScope) {
    const self = this;

    this.data = null;

    this.setAction = function setAction(path, data) {
      $rootScope.$broadcast('RA.modal.setAction', path, data);
    };

    this.setData = function setData(data) {
      if (data) {
        self.data = data;
      } else {
        self.data = null;
      }
    };

    this.getData = function getData() {
      return self.data;
    };

    this.resetAction = function resetAction() {
      self.setAction();
    };
  },
]);
