{
  class DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl {
    /* @ngInject */
    constructor($scope, $stateParams, $translate, DedicatedCloud) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.DedicatedCloud = DedicatedCloud;
    }

    $onInit() {
      this.maxSimultaneousConnections = {
        value: null,
        current: this.$scope.currentActionData,
      };

      this.$scope.update = () => this.update();
    }

    update() {
      this.$scope.resetAction();

      return this.DedicatedCloud.updateMaxConcurrentConnections(
        this.$stateParams.productId,
        this.maxSimultaneousConnections.value,
      )
        .then((data) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_SECURITY_change_nb_simultaneous_connection_success',
            ),
            {
              ...data,
              type: 'success',
            },
          );
        })
        .catch((err) => {
          this.$scope.setMessage(
            this.$translate.instant(
              'dedicatedCloud_SECURITY_change_nb_simultaneous_connection_failure',
            ),
            {
              ...err,
              type: 'error',
            },
          );
        });
    }
  }

  angular
    .module('App')
    .controller(
      'DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl',
      DedicatedCloudSecurityMaxSimultaneousConnectionsCtrl,
    );
}
