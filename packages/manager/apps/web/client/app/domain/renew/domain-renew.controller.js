angular.module('App').controller(
  'DomainRenewCtrl',
  class DomainRenewCtrl {
    /* @ngInject */
    constructor($scope, constants) {
      this.$scope = $scope;
      this.constants = constants;
    }

    $onInit() {
      this.domainToRenew = angular.copy(this.$scope.currentActionData);
      this.$scope.displayBC = () => this.displayBC();
    }

    displayBC() {
      this.$scope.resetAction();
      window.open(
        URI.expand(this.constants.renew, {
          serviceName: this.domainToRenew.name,
        }).toString(),
        '_blank',
      );
    }
  },
);
