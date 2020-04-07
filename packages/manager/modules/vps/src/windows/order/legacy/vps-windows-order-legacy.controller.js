import forEach from 'lodash/forEach';
import 'moment';

export default class VpsWindowsOrderLegacyCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    $window,
    CucCloudMessage,
    CucCloudNavigation,
    VpsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucCloudNavigation = CucCloudNavigation;
    this.VpsService = VpsService;

    this.loaders = {
      durations: false,
      prices: false,
    };

    this.durations = {
      available: null,
      details: {},
    };

    this.model = {
      duration: null,
      url: null,
      contractsValidated: null,
    };
  }

  $onInit() {
    this.previousState = this.CucCloudNavigation.getPreviousState();
  }

  getDurations() {
    this.loaders.durations = true;
    this.VpsService.getWindowsOptionDurations(this.serviceName)
      .then((durations) => {
        this.durations.available = durations;
        return this.loadPrices(durations);
      })
      .catch((err) => this.CucCloudMessage.error(err.data.message || err.data))
      .finally(() => {
        this.loaders.durations = false;
      });
  }

  loadPrices(durations) {
    const queue = [];
    this.loaders.prices = true;

    forEach(durations, (duration) => {
      queue.push(
        this.VpsService.getWindowsOptionOrder(this.serviceName, duration).then(
          (details) => {
            this.durations.details[duration] = {
              ...details,
              label: moment(duration.split('upto-')[1]).format('LL'),
            };
          },
        ),
      );
    });

    return this.$q
      .all(queue)
      .catch((err) =>
        this.CucCloudMessage.error(
          err.data || this.$translate.instant('vps_order_windows_price_error'),
        ),
      )
      .finally(() => {
        this.loaders.prices = false;
      });
  }

  canValidateContracts() {
    this.model.contractsValidated = false;
    if (
      !this.durations.details[this.model.duration].contracts ||
      !this.durations.details[this.model.duration].contracts.length
    ) {
      return true;
    }
    return false;
  }

  orderOption() {
    this.VpsService.postWindowsOptionOrder(
      this.serviceName,
      this.model.duration,
    )
      .then(({ url }) => {
        this.model.url = url;
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          error || this.$translate.instant('vps_order_windows_order_error'),
        ),
      );
  }

  cancel() {
    this.previousState.go();
  }

  confirm() {
    this.displayBC();
  }

  displayBC() {
    this.$window.open(this.model.url, '_blank');
  }
}
