angular.module('App').controller(
  'DomainsRenewCtrl',
  class DomainsRenewCtrl {
    /* @ngInject */
    constructor($scope, $window, constants) {
      this.$scope = $scope;
      this.$window = $window;
      this.constants = constants;
    }

    $onInit() {
      this.domainsToRenew = [];

      if (this.$scope.currentActionData) {
        this.domainsToRenew.push(this.$scope.currentActionData.name);
      } else {
        this.domainsToRenew = this.$scope.getSelectedDomains();
      }

      this.$scope.displayBC = () => {
        this.$scope.resetAction();
        this.$window.open(
          URI.expand(this.constants.renew, {
            serviceName: this.domainsToRenew.join(' '),
          }).toString(),
          '_blank',
        );
      };
    }
  },
);
