angular.module('App').controller(
  'DedicatedCloudUserDisableCtrl',
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

      this.$scope.disableUser = () => this.disableUser();
    }

    disableUser() {
      this.$scope.resetAction();

      return this.DedicatedCloud.disableUser(
        this.$stateParams.productId,
        this.$scope.user.userId,
      )
        .then(() => {
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_USER_disable_success', {
              t0: this.$scope.user.name,
            }),
          );
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant('dedicatedCloud_USER_disable_fail', {
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
