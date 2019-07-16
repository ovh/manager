export default class ExchangeWizardHostedCreationManualController {
  /* @ngInject */
  constructor(navigation, $scope, $translate) {
    this.navigation = navigation;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.domainName = this.navigation.currentActionData.domainName;

    this.$scope.hideCancelButton = () => true;
  }
}
