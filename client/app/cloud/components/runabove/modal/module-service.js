angular.module('managerApp').service('RA.modalService', ['$rootScope', function ($rootScope) {
  const self = this;

  this.data = null;

  this.setAction = function (path, data) {
    console.log('jaja');
    $rootScope.$broadcast('RA.modal.setAction', path, data);
  };

  this.setData = function (data) {
    if (data) {
      self.data = data;
    } else {
      self.data = null;
    }
  };

  this.getData = function () {
    return self.data;
  };

  this.resetAction = function () {
    self.setAction();
  };
}]);
