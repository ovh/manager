export default class ExchangeWizardHostedCreationEmailCreationDeleteController {
  /* @ngInject */
  constructor(
    wucExchange,
    messaging,
    navigation,
    $rootScope,
    $scope,
    $translate,
  ) {
    this.wucExchange = wucExchange;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
  }

  $onInit() {
    this.$routerParams = this.wucExchange.getParams();
    this.account = this.navigation.currentActionData;

    this.$scope.deleting = () => this.deleting();
  }

  deleting() {
    return this.wucExchange
      .removingAccount(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.account.primaryEmailAddress,
      )
      .catch((error) => {
        this.messaging.writeError(
          this.$translate.instant('exchange_tab_account_remove_failure'),
          error,
        );
      })
      .finally(() => {
        this.$rootScope.$broadcast('exchange.wizard.request.done');
        this.navigation.resetAction();
      });
  }
}
