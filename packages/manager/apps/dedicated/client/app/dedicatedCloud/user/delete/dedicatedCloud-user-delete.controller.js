angular.module('App').controller(
  'DedicatedCloudUserDeleteCtrl',
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

      this.$scope.deleteUser = () => this.deleteUser();
    }

    deleteUser() {
      this.$scope.resetAction();

      return this.DedicatedCloud.deleteUser(
        this.$stateParams.productId,
        this.$scope.user.userId,
      )
        .then(() => {
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_USER_delete_success', {
              t0: this.$scope.user.name,
            }),
            {
              type: 'success',
            },
          );
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_USER_delete_fail', {
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
