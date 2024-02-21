import { TRACKING_PREFIX_AGGREGATE } from '../constants';
export default class IpByoipAggregateController {
  /* @ngInject */
  constructor($scope, IpByoipService, Alerter, $translate, atInternet) {
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
  }

  $onInit() {
    this.atInternet.trackPage({ name: TRACKING_PREFIX_AGGREGATE });
    this.IpByoipService.getAvailableAggregationConfigurations(this.ip.ipBlock)
      .then(({ data }) => {
        this.aggregationIps = data;
        if (this.aggregationIps.length) {
          [this.selectedAggregationIp] = this.aggregationIps;
        }
      })
      .catch(({ data: { message } }) => {
        this.errorMessage = message;
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
      .catch(({ data: { message } }) => {
        this.errorMessage = message;
      })
      .finally(() => {
        this.isLoaded = true;
      });
  }
}
