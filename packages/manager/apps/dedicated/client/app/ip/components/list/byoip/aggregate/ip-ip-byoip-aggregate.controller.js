import { TRACKING_PREFIX_AGGREGATE, BYOIP_USAGE_GUIDE_URL } from '../constants';

export default class IpByoipAggregateController {
  /* @ngInject */
  constructor(
    $scope,
    IpByoipService,
    Alerter,
    $translate,
    atInternet,
    coreConfig,
  ) {
    this.$scope = $scope;
    this.IpByoipService = IpByoipService;
    this.ip = $scope.currentActionData.ipBlock;
    this.aggregationIps = [];
    this.selectedAggregationIp = {};
    this.isLoaded = false;
    this.errorMessage = null;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.byoipUsageGuideUrl =
      BYOIP_USAGE_GUIDE_URL[coreConfig.getUser().ovhSubsidiary] ||
      BYOIP_USAGE_GUIDE_URL.DEFAULT;
  }

  $onInit() {
    this.showErrorMessage = false;
    this.atInternet.trackPage({ name: TRACKING_PREFIX_AGGREGATE });
    this.IpByoipService.getAvailableAggregationConfigurations(this.ip.ipBlock)
      .then(({ data }) => {
        this.aggregationIps = data;
        if (this.aggregationIps.length) {
          [this.selectedAggregationIp] = this.aggregationIps;
        } else {
          this.showErrorMessage = true;
          this.errorMessage = this.$translate.instant(
            'ip_byoip_aggregate_slicing_not_available_error_message',
            {
              url: this.byoipUsageGuideUrl,
            },
          );
        }
      })
      .catch((error) => {
        this.displayErrorMessage(error);
      })
      .finally(() => {
        this.isLoaded = true;
      });
  }

  trackClick(hit) {
    this.atInternet.trackClick({
      type: 'action',
      name: `${TRACKING_PREFIX_AGGREGATE}::${hit}`,
    });
  }

  cancelAggregate() {
    this.trackClick('cancel');
    this.$scope.resetAction();
  }

  aggregate() {
    this.showErrorMessage = false;
    this.trackClick('confirm');
    this.isLoaded = false;
    this.IpByoipService.postAggregateBYOIP(
      this.ip.ipBlock,
      this.selectedAggregationIp.aggregationIp,
    )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('ip_table_manage_byoip_aggregate_success'),
        );
        this.$scope.resetAction();
      })
      .catch((error) => {
        this.displayErrorMessage(error);
      })
      .finally(() => {
        this.isLoaded = true;
      });
  }

  displayErrorMessage(error) {
    this.showErrorMessage = true;
    if (error.status === 404) {
      this.errorMessage = this.$translate.instant(
        'ip_byoip_aggregate_ip_doesnt_exist_error_message',
      );
    } else {
      this.errorMessage = error.data.message;
    }
  }
}
