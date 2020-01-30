import get from 'lodash/get';
import round from 'lodash/round';

export default class SharepointAccountAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
    MicrosoftSharepointOrderService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointLicense = MicrosoftSharepointLicenseService;
    this.sharepointOrder = MicrosoftSharepointOrderService;
  }

  $onInit() {
    this.loading = true;
    this.price = null;
    this.quantity = 1;
    this.isProvider = false;

    this.sharepointLicense
      .getSharepoint(this.$stateParams.exchangeId)
      .then(({ offer }) => {
        this.isProvider = offer === 'provider';
      })
      .then(() => this.sharepointOrder.creatingCart())
      .then((cartId) =>
        this.sharepointOrder.fetchingPrices(
          cartId,
          `activedirectory-account-${this.isProvider ? 'provider' : 'hosted'}`,
          `sharepoint-account-${this.isProvider ? 'provider' : 'hosted'}-2016`,
        ),
      )
      .then((prices) => {
        this.price = get(prices, 'P1M');
      })
      .catch((err) => {
        this.$scope.resetAction();
        this.alerter.alertFromSWS(
          this.$translate.instant(
            'sharepoint_accounts_action_sharepoint_add_error_message',
          ),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  getTotalPrice() {
    return round(get(this.price, 'value', 0) * this.quantity, 2);
  }

  getCurrency() {
    return get(this.price, 'currencyCode') === 'EUR'
      ? '&#0128;'
      : get(this.price, 'currencyCode');
  }

  submit() {
    const getOrderUrl = this.isProvider
      ? this.sharepointLicense.getSharepointProviderNewAccountOrderUrl.bind(
          this.sharepointLicense,
        )
      : this.sharepointLicense.getSharepointStandaloneNewAccountOrderUrl.bind(
          this.sharepointLicense,
        );

    this.alerter.success(
      this.$translate.instant(
        'sharepoint_account_action_sharepoint_add_success_message',
      ),
      this.$scope.alerts.main,
    );
    this.$scope.resetAction();
    const win = window.open('', '_blank');
    win.opener = null;
    win.location = getOrderUrl(this.$stateParams.exchangeId, this.quantity);
  }
}
