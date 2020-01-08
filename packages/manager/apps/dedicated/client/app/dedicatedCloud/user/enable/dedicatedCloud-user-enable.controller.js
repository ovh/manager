angular.module('App').controller(
  'DedicatedCloudUserEnableCtrl',
  class {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.$scope.user = this.$scope.currentActionData;

      this.$scope.enableUser = () => this.enableUser();
    }

    enableUser() {
      this.$scope.resetAction();

      return this.DedicatedCloud.enableUser(
        this.$stateParams.productId,
        this.$scope.user.userId,
      ).catch((err) => {
        this.$scope.setMessage(
          this.$translate.instant('dedicatedCloud_USER_enable_fail', {
            t0: this.$scope.user.name,
          }),
          {
            ...err,
            type: 'error',
          },
        );
      });
    }
  },
);
