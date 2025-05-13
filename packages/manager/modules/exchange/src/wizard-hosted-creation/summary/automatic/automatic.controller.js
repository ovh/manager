export default class ExchangeWizardHostedCreationAutoController {
  /* @ngInject */
  constructor(wucExchange, navigation, $scope, $translate) {
    this.wucExchange = wucExchange;
    this.navigation = navigation;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.webUrl = this.wucExchange.value.webUrl;
    this.domainName = this.navigation.currentActionData.domainName;

    this.$scope.hideCancelButton = () => true;
  }
}
