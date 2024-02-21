import { TRACKING_PREFIX_SLICE } from '../constants';

export default class IpByoipSliceController {
  /* @ngInject */
  constructor($scope, IpByoipService, $translate, Alerter, atInternet) {
    this.$scope = $scope;
    this.IpByoipService = IpByoipService;
    this.ip = $scope.currentActionData.ipBlock;
    this.ipSizes = [];
    this.selectedSize = {};
    this.isLoaded = false;
    this.errorMessage = null;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackPage({ name: TRACKING_PREFIX_SLICE });
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

  trackClick(hit) {
    this.atInternet.trackClick({
      type: 'action',
      name: `${TRACKING_PREFIX_SLICE}::${hit}`,
    });
  }

  cancelSlice() {
    this.trackClick('cancel');
    this.$scope.resetAction();
  }

  slice() {
    this.trackClick('confirm');
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
