angular.module('controllers').controller(
  'DomainDnsSecSaveCtrl',
  class DomainDnsSecSaveCtrl {
    /* @ngInject */
    constructor($scope, $rootScope) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
    }

    $onInit() {
      this.$scope.saveDnsSec = () => this.saveDnsSec();
    }

    saveDnsSec() {
      this.$rootScope.$broadcast('domain.tabs.dnssec.save');
      this.$scope.resetAction();
    }
  },
);
