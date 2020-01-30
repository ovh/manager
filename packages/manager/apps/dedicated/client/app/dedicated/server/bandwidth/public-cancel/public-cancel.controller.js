import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor($rootScope, $scope, $translate) {
    this.setMessage = $scope.setMessage;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
  }

  cancelOption() {
    this.isLoading = true;

    this.cancelBandwidthOption()
      .then(() => {
        this.setMessage(
          this.$translate.instant('server_cancel_bandwidth_cancel_success'),
          true,
        );
        this.$rootScope.$broadcast('dedicated.informations.bandwidth');
      })
      .catch((data) => {
        set(data, 'type', 'ERROR');
        this.setMessage(
          this.$translate.instant('server_cancel_bandwidth_cancel_error'),
          data,
        );
      })
      .finally(() => {
        this.isLoading = false;
        this.goBack();
      });
  }
}
