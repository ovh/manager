import set from 'lodash/set';

export default class SharepointInformationsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $location,
    $stateParams,
    $translate,
    Alerter,
    MicrosoftSharepointLicenseService,
  ) {
    this.$scope = $scope;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.sharepointService = MicrosoftSharepointLicenseService;
  }

  $onInit() {
    this.loaders = {
      init: false,
    };
    this.exchangeId = this.$stateParams.exchangeId;
    this.hideAssociatedExchange = !this.exchangeId;

    this.getAssociatedExchange();
    this.getSharepoint();
  }

  getAssociatedExchange() {
    return this.sharepointService
      .getAssociatedExchangeService(this.exchangeId)
      .then(({ exchangeService, exchangeLink }) => {
        this.associatedExchange = exchangeService;
        this.associatedExchangeLink = exchangeLink;
      });
  }

  getSharepoint() {
    this.loaders.init = true;
    return this.sharepointService
      .getSharepoint(this.exchangeId)
      .then((sharepoint) => {
        this.sharepoint = sharepoint;
        if (!this.sharepoint.url) {
          this.$location.path(
            `/sharepoint/${this.exchangeId}/${this.sharepoint.domain}/setUrl`,
          );
        } else {
          this.calculateQuotas(sharepoint);
        }
      })
      .catch((err) => {
        set(err, 'type', err.type || 'ERROR');
        this.alerter.alertFromSWS(
          this.$translate.instant('sharepoint_dashboard_error'),
          err,
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  calculateQuotas(sharepoint) {
    if (sharepoint.quota && sharepoint.currentUsage) {
      set(sharepoint, 'left', sharepoint.quota - sharepoint.currentUsage);
    }
    this.sharepoint = sharepoint;
  }

  currentusageInGb() {
    return this.sharepoint.currentUsage / 1024 ** 3;
  }
}
