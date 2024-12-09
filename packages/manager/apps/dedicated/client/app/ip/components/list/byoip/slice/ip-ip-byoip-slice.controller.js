import {
  TRACKING_PREFIX_SLICE,
  BYOIP_SLICE_PARK_IT_FIRST_ERROR_REGEX,
  BYOIP_USAGE_GUIDE_URL,
} from '../constants';

export default class IpByoipSliceController {
  /* @ngInject */
  constructor(
    $scope,
    IpByoipService,
    $translate,
    Alerter,
    atInternet,
    coreConfig,
  ) {
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
    this.byoipUsageGuideUrl =
      BYOIP_USAGE_GUIDE_URL[coreConfig.getUser().ovhSubsidiary] ||
      BYOIP_USAGE_GUIDE_URL.DEFAULT;
  }

  $onInit() {
    this.showErrorMessage = false;
    this.atInternet.trackPage({ name: TRACKING_PREFIX_SLICE });
    this.IpByoipService.getAvailableSlicingConfigurations(this.ip.ipBlock)
      .then(({ data }) => {
        this.ipSizes = data;
        if (this.ipSizes.length) {
          [this.selectedSize] = this.ipSizes;
        } else {
          this.showErrorMessage = true;
          this.errorMessage = this.$translate.instant(
            'ip_byoip_aggregate_slicing_not_available_error_message',
            {
              url: this.byoipUsageGuideUrl,
            },
          );
        }
        this.isLoaded = true;
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
      name: `${TRACKING_PREFIX_SLICE}::${hit}`,
    });
  }

  cancelSlice() {
    this.trackClick('cancel');
    this.$scope.resetAction();
  }

  slice() {
    this.showErrorMessage = false;
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
    } else if (
      error.status === 400 &&
      BYOIP_SLICE_PARK_IT_FIRST_ERROR_REGEX.test(error.data.message)
    ) {
      this.errorMessage = this.$translate.instant(
        'ip_byoip_slicing_park_it_first_error_message',
      );
    } else {
      this.errorMessage = error.data.message;
    }
  }
}
