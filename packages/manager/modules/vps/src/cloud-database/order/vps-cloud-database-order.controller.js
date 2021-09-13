import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    $window,
    atInternet,
    coreConfig,
    CucCloudMessage,
    OvhApiHostingPrivateDatabase,
    OvhApiOrderPrivateDatabase,
    OvhApiMe,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.CucCloudMessage = CucCloudMessage;
    this.ApiPrivateDb = OvhApiHostingPrivateDatabase.v6();
    this.ApiOrderDb = OvhApiOrderPrivateDatabase.v6();
    this.ApiMe = OvhApiMe.v6();
  }

  $onInit() {
    this.loading = {
      durations: false,
      redirection: false,
      purchaseOrder: false,
    };

    this.versions = [];
    this.ramAmounts = [];
    this.datacenters = [];
    this.durations = null;

    this.currentOrder = {
      version: null,
      ram: null,
      datacenter: null,
      duration: null,
      contractsAccepted: false,
    };

    this.purchaseOrder = null;
    this.redirectionTimeout = null;

    this.loadSelectValues();
    this.user = this.coreConfig.getUser();
  }

  loadSelectValues() {
    return this.ApiPrivateDb.availableOrderCapacities({ offer: 'public' })
      .$promise.then((capacity) => {
        this.versions = capacity.version.sort().map((version) => ({
          value: version,
          name: this.$translate.instant(
            `vps_database_version_${version.replace('.', '')}`,
          ),
        }));
        this.ramAmounts = capacity.ram.map((ram) => ({
          value: ram,
          name: `${ram} ${this.$translate.instant('unit_size_MB')}`,
        }));
        this.datacenters = capacity.datacenter.map((datacenter) => ({
          value: datacenter,
          name: this.$translate.instant(`vps_datacenter_${datacenter}`),
        }));
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_tab_cloud_database_order_fetch_capacities_failed',
            ),
            get(error, 'data.message', error),
          ].join(' '),
        ),
      );
  }

  showOrRefreshDurations() {
    this.cancelFurtherChoices();

    if (
      !this.currentOrder.version ||
      !this.currentOrder.ram ||
      !this.currentOrder.datacenter
    ) {
      return this.$q.when();
    }

    const version = this.currentOrder.version.value;
    const ram = this.currentOrder.ram.value;
    const datacenter = this.currentOrder.datacenter.value;

    this.loading.durations = true;
    return this.ApiOrderDb.getNew({ version, ram, datacenter })
      .$promise.then((durations) => {
        this.durations = map(durations, (duration) => ({
          value: duration,
          prices: null,
        }));
        // we run this in parallel, so no return
        this.getPricesForEachDuration(this.durations, version, ram, datacenter);
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_tab_cloud_database_order_fetch_duration_failed',
            ),
            get(error, 'data.message', error),
          ].join(' '),
        ),
      )
      .finally(() => {
        this.loading.durations = false;
      });
  }

  cancelFurtherChoices() {
    this.$timeout.cancel(this.redirectionTimeout);
    this.loading.purchaseOrder = false;
    this.loading.redirection = false;

    this.currentOrder.duration = null;
    this.currentOrder.contractsAccepted = false;
    this.purchaseOrder = null;
  }

  getPricesForEachDuration(durations, version, ram, datacenter) {
    return this.$q
      .all(
        map(durations, (duration) =>
          this.getPrices(duration, version, ram, datacenter),
        ),
      )
      .catch((error) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant(
              'vps_tab_cloud_database_order_fetch_prices_failed',
            ),
            get(error, 'data.message', error),
          ].join(' '),
        ),
      );
  }

  getPrices(duration, version, ram, datacenter) {
    return this.ApiOrderDb.getNewDetails({
      duration: duration.value,
      version,
      ram,
      datacenter,
    }).$promise.then((details) => {
      // we want to trigger a change in the UI
      // by assigning prices to each already shown duration
      Object.assign(duration, { details });
    });
  }

  canOrder() {
    return (
      !some(this.loading) &&
      this.currentOrder.version &&
      this.currentOrder.ram &&
      this.currentOrder.datacenter &&
      this.currentOrder.duration &&
      this.currentOrder.contractsAccepted
    );
  }

  generatePurchaseOrder() {
    this.loading.purchaseOrder = true;
    this.loading.redirection = true;
    return this.ApiOrderDb.orderNew(
      { duration: this.currentOrder.duration.value },
      {
        version: this.currentOrder.version.value,
        ram: this.currentOrder.ram.value,
        datacenter: this.currentOrder.datacenter.value,
        offer: 'public',
      },
    )
      .$promise.then((order) => {
        this.purchaseOrder = order;
        this.redirectionTimeout = this.$timeout(() => {
          this.loading.redirection = false;
          this.openPurchaseOrder(false);
        }, 5000);
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          [
            this.$translate.instant('vps_tab_cloud_database_order_failed'),
            get(error, 'data.message', error),
          ].join(' '),
        ),
      )
      .finally(() => {
        this.loading.purchaseOrder = false;
      });
  }

  openPurchaseOrder(killAutoRedirection) {
    if (killAutoRedirection) {
      this.loading.redirection = false;
      this.$timeout.cancel(this.redirectionTimeout);
    }

    this.atInternet.trackOrder({
      name: `[sql-public]::${this.currentOrder.version.value}`,
      page: 'web::payment-pending',
      orderId: this.purchaseOrder.orderId,
      priceTaxFree: this.purchaseOrder.prices.withoutTax.value,
      price: this.purchaseOrder.prices.withTax.value,
      status: 1,
    });
    this.$window.open(this.purchaseOrder.url);
  }
}
