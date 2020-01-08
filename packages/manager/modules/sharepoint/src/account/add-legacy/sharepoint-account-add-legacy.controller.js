import get from 'lodash/get';
import round from 'lodash/round';

export default class SharepointAccountAddLegacyCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.loading = false;
    this.retrievingSharepointServiceOptions();

    this.$scope.submit = () => this.submit();
  }

  retrievingSharepointServiceOptions() {
    this.loading = true;
    return this.sharepointService
      .retrievingSharepointServiceOptions(this.$stateParams.productId)
      .then((options) => {
        this.optionsList = options;
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

  static getPrice(option) {
    return round(
      get(option, 'prices[0].price.value', 0) *
        get(option, 'prices[0].quantity', 0),
      2,
    );
  }

  static getCurrency(option) {
    return get(option, 'prices[0].price.currencyCode') === 'EUR'
      ? '&#0128;'
      : get(option, 'prices[0].price.currencyCode');
  }

  submit() {
    this.alerter.success(
      this.$translate.instant(
        'sharepoint_account_action_sharepoint_add_success_message',
      ),
      this.$scope.alerts.main,
    );
    this.$scope.resetAction();

    const win = window.open('', '_blank');
    win.opener = null;
    win.location = this.sharepointService.getSharepointStandaloneNewAccountOrderLegacyUrl(
      this.$stateParams.productId,
      this.optionsList[0].prices[0].quantity,
    );
  }
}
