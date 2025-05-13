export default class ChangeBandwidthCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    changeBandwidthService,
    cloudConnectService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.changeBandwidthService = changeBandwidthService;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.offer = null;
    this.isLoading = true;
    this.changeBandwidthService
      .loadAvailableOffers(this.serviceId)
      .then((data) => {
        this.upgradeOffers = data.map((upgradeOffer) => ({
          ...upgradeOffer,
          bandwidthLabel: this.cloudConnectService.translateBandwidth(
            upgradeOffer.planCode.split('-')[2],
          ),
        }));
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  changeBandwidth() {
    const { planCode, prices } = this.offer;
    let msg;
    let type;
    const price = prices.find(({ capacities }) =>
      capacities.includes('upgrade'),
    );

    this.isLoading = true;
    this.changeBandwidthService
      .upgradeBandwidth(planCode, this.serviceId, price)
      .then(({ order: { orderId, url } }) => {
        this.$window.open(url, '_blank', 'noopener');
        msg = this.$translate.instant(
          'cloud_connect_change_bandwidth_warning',
          { orderId, url },
        );
        type = 'warning';
      })
      .catch((error) => {
        const message = error?.data?.message || error;
        msg = this.$translate.instant('cloud_connect_change_bandwidth_error', {
          message,
        });
        type = 'error';
      })
      .finally(() => {
        this.isLoading = false;
        this.goBack(msg, type, true);
      });
  }
}
