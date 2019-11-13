export default class VpsOrderDisklegacyOrderController {
  /* @ngInject */
  constructor($filter, $stateParams, $state, $translate, $q, $window, CucCloudMessage,
    CucCloudNavigation, VpsService,
    CucServiceHelper) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.$q = $q;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.serviceName = $stateParams.serviceName;
    this.VpsService = VpsService;
    this.CucServiceHelper = CucServiceHelper;

    this.loaders = {
      capacity: false,
      offer: false,
      order: false,
    };

    this.model = {
      capacity: null,
      duration: null,
      url: null,
      contractsValidated: null,
    };
    this.capacityArray = [];
    this.offer = null;
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
  }

  getAdditionalDiskPrices() {
    this.loaders.capacity = true;
    this.VpsService.getAdditionalDiskPrices(this.serviceName)
      .then((data) => { this.capacityArray = data; })
      .catch(error => this.CucCloudMessage.error(error || this.$translate.instant('vps_order_additional_disk_fail')))
      .finally(() => { this.loaders.capacity = false; });
  }

  getAdditionalDiskFinalPrice() {
    this.loaders.offer = true;
    this.VpsService.getAllowedDuration(this.serviceName, this.model.capacity)
      .then((duration) => {
        this.model.duration = duration;
        this.VpsService
          .getAdditionalDiskFinalPrice(this.serviceName, this.model.capacity, this.model.duration)
          .then((offer) => { this.offer = offer; })
          .catch(error => this.CucCloudMessage.error(error || this.$translate.instant('vps_order_additional_disk_fail')))
          .finally(() => { this.loaders.offer = false; });
      })
      .catch(error => this.CucCloudMessage.error(error || this.$translate.instant('vps_order_additional_disk_fail')));
  }

  orderAdditionalDiskOption() {
    this.loaders.order = true;
    this.CucServiceHelper
      .loadOnNewPage(this.VpsService.postAdditionalDiskOrder(
        this.serviceName,
        this.model.capacity,
        this.model.duration,
      ))
      .then(({ url }) => {
        this.model.url = url;
      })
      .finally(() => {
        this.loaders.order = false;
      });
  }

  cancel() {
    this.previousState.go();
  }

  confirm() {
    this.orderAdditionalDiskOption();
  }

  displayBC() {
    this.$window.open(
      this.model.url,
      '_blank',
    );
  }
}
