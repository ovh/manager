export default class IpByoipAggregateController {
  /* @ngInject */
  constructor($scope, IpByoipService) {
    this.$scope = $scope;
    this.IpByoipService = IpByoipService;
    this.ip = $scope.currentActionData.ipBlock;
    this.aggregationIps = [];
    this.selectedAggregationIp = {};
    this.isLoaded = false;
    this.errorMessage = null;
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
    this.IpByoipService.postAggregateBOYIP(
      this.ip.ipBlock,
      this.selectedAggregationIp.aggregationIp,
    )
      .then(() => {
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
