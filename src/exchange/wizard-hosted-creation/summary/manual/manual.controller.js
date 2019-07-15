angular.module('Module.exchange.controllers').controller(
  'exchangeWizardHostedCreationManualController',
  class ExchangeWizardHostedCreationManualController {
    constructor(navigation, $scope, $translate) {
      this.navigation = navigation;
      this.$scope = $scope;
      this.$translate = $translate;
    }

    $onInit() {
      this.domainName = this.navigation.currentActionData.domainName;

      this.$scope.hideCancelButton = () => true;
    }
  },
);
