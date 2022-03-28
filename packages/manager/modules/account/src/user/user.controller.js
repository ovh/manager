export default class UserAccountCtrl {
  /* @ngInject */
  constructor($location, $scope, $state, $timeout, constants, supportLevel) {
    // dependencies injections
    this.$location = $location;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.constants = constants;
    this.supportLevel = supportLevel;
    this.USERACCOUNT_BASE_URL = 'account/user/';
    this.originUrl =
      this.$location.search().redirectTo || this.$location.search().redirectto;
  }

  $onInit() {
    this.$scope.stepPath = '';
    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;

    this.$scope.resetAction = function resetAction() {
      this.$scope.setAction(false);
    }.bind(this);

    this.$scope.setAction = function setAction(action, data, basePath) {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;
      if (action) {
        if (basePath) {
          this.$scope.stepPath = `${basePath}${this.$scope.currentAction}.html`;
        } else {
          this.$scope.stepPath = `${this.USERACCOUNT_BASE_URL}${this.$scope.currentAction}.html`;
        }
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }.bind(this);
  }
}
