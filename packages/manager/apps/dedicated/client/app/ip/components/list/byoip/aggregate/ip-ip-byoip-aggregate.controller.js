export default class IpByoipAggregateController {
  /* @ngInject */
  constructor($scope, IpByoipService, Alerter, $translate) {
    this.$scope = $scope;
    this.IpByoipService = IpByoipService;
    this.ip = $scope.currentActionData.ipBlock;
    this.aggregationIps = [];
    this.selectedAggregationIp = {};
    this.isLoaded = false;
    this.errorMessage = null;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
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

  cancelAggregate() {
    this.$scope.resetAction();
  }

  aggregate() {
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
