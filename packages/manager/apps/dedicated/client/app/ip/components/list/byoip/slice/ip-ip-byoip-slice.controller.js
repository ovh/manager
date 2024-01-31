export default class IpByoipSliceController {
  /* @ngInject */
  constructor($scope, IpByoipService, $translate, Alerter) {
    this.$scope = $scope;
    this.IpByoipService = IpByoipService;
    this.ip = $scope.currentActionData.ipBlock;
    this.ipSizes = [];
    this.selectedSize = {};
    this.isLoaded = false;
    this.errorMessage = null;
    this.Alerter = Alerter;
    this.$translate = $translate;
  }

  $onInit() {
    this.IpByoipService.getAvailableSlicingConfigurations(this.ip.ipBlock)
      .then(({ data }) => {
        this.ipSizes = data;
        if (this.ipSizes.length) {
          [this.selectedSize] = this.ipSizes;
        }
        this.isLoaded = true;
      })
      .catch(({ data: { message } }) => {
        this.errorMessage = message;
      })
      .finally(() => {
        this.isLoaded = true;
      });
  }

  cancelSlice() {
    this.$scope.resetAction();
  }

  slice() {
    this.isLoaded = false;
    this.IpByoipService.postSliceBYOIP(
      this.ip.ipBlock,
      this.selectedSize.slicingSize,
    )
      .then(() => {
        this.Alerter.success(
          this.$translate.instant('ip_table_manage_byoip_slice_success'),
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
