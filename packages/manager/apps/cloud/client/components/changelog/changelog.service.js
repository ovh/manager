angular
  .module('managerApp')
  .service('ChangelogService', function ChangelogService($uibModal) {
    this.show = function show() {
      $uibModal.open({
        templateUrl: 'components/changelog/changelog.html',
        controller: 'ChangelogCtrl',
        controllerAs: 'ChangelogCtrl',
      });
    };
  });
