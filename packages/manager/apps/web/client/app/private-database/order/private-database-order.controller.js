import isString from 'lodash/isString';
import map from 'lodash/map';

angular.module('App').controller(
  'PrivateDatabaseOrderCtrl',
  class PrivateDatabaseOrderCtrl {
    constructor(
      Alerter,
      $location,
      Hosting,
      PrivateDatabase,
      $q,
      $scope,
      $translate,
      User,
    ) {
      this.alerter = Alerter;
      this.$location = $location;
      this.hostingService = Hosting;
      this.privateDatabaseService = PrivateDatabase;
      this.$q = $q;
      this.$scope = $scope;
      this.$translate = $translate;
      this.User = User;
    }

    $onInit() {
      this.$scope.alerts = {
        order: 'privatedatabase.alerts.order',
        durations: 'privatedatabase.alerts.order.duration',
      };

      this.datacenterSelected = this.$location.search().datacenter;

      this.selectedHosting = {
        value: '',
      };

      this.list = {
        versions: [],
        ramSize: [],
      };

      this.selectedOrder = {
        config: {
          version: null,
          ramSize: null,
          datacenter: this.datacenterSelected,
        },
        duration: null,
        contractsValidated: false,
      };

      this.loading = {
        init: false,
        durations: false,
        prices: false,
        bc: false,
      };

      this.durations = {
        available: null,
        details: {},
      };

      this.order = null;

      this.loading.init = true;

      this.$scope.$on('$destroy', () => {
        const queryParams = this.$location.search();

        if (queryParams && queryParams.datacenter) {
          delete queryParams.datacenter;
          this.$location.search(queryParams);
        }
      });

      this.$scope.sortRam = (ram) => {
        if (isString(ram)) {
          return +ram;
        }
        return '';
      };

      this.User.getUser().then((user) => {
        this.user = user;
      });

      this.init();
    }

    loadPrices(durations) {
      this.loading.prices = true;

      this.$q
        .all(
          map(durations, (duration) =>
            this.privateDatabaseService
              .orderPrice(
                this.selectedOrder.config.version,
                this.selectedOrder.config.ramSize,
                duration,
              )
              .then((details) => {
                this.durations.details[duration] = details;
                return details;
              }),
          ),
        )
        .then(() => {
          if (durations && durations.length === 1) {
            [this.model.duration] = durations;
          }

          this.loading.prices = false;
        })
        .catch((data) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('privateDatabase_order_step2_price_fail'),
            data,
            this.$scope.alerts.order,
          );
          this.loading.durations = false;
        });
    }

    init() {
      this.$q
        .all({
          models: this.privateDatabaseService.getOrderModels(),
          hostings: this.hostingService.getHostings(),
        })
        .then((result) => {
          this.list.versions =
            result.models['hosting.PrivateDatabase.OrderableVersionEnum'].enum;
          this.list.ramSize =
            result.models['hosting.PrivateDatabase.AvailableRamSizeEnum'].enum;
          this.list.datacenters =
            result.models['hosting.PrivateDatabase.DatacenterEnum'].enum;
          this.hostings = result.hostings;
        })
        .catch(() =>
          this.alerter.error(
            this.$translate.instant('privateDatabase_order_step1_error'),
            this.$scope.alerts.order,
          ),
        )
        .finally(() => {
          this.loading.init = false;
        });
    }

    onHostingChanged() {
      this.selectedOrder.config.datacenter = null;

      if (
        this.selectedHosting.value === 'other' ||
        !this.selectedHosting.value
      ) {
        return;
      }
      this.hostingService
        .getHosting(this.selectedHosting.value)
        .then((hosting) => {
          this.selectedOrder.config.datacenter = hosting.datacenter;
        })
        .catch(() =>
          this.alerter.error(
            this.$translate.instant('privateDatabase_order_step1_error'),
            this.$scope.alerts.order,
          ),
        );
    }

    getDurations() {
      this.alerter.resetMessage(this.$scope.alerts.durations);

      this.durations = {
        available: null,
        details: {},
      };
      this.loading.durations = true;

      return this.privateDatabaseService
        .orderDuration(
          this.selectedOrder.config.version,
          this.selectedOrder.config.ramSize,
        )
        .then((durations) => {
          this.durations.available = durations;
          this.loadPrices(durations);
        })
        .catch((data) =>
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'privateDatabase_order_step2_duration_fail',
            ),
            data,
            this.$scope.alerts.durations,
          ),
        )
        .finally(() => {
          this.loading.durations = false;
        });
    }

    generateBc() {
      this.loading.bc = true;

      return this.privateDatabaseService
        .orderPrivateDatabase(
          this.selectedOrder.config.version,
          this.selectedOrder.config.ramSize,
          this.selectedOrder.duration,
          this.selectedOrder.config.datacenter,
        )
        .then((details) => {
          this.order = details;
          this.loading.bc = false;
        })
        .catch((data) => {
          this.alerter.alertFromSWS(
            this.$translate.instant('privateDatabase_order_step3_fail'),
            data,
            this.$scope.alerts.order,
          );
          this.loading.durations = false;
        });
    }

    openBc() {
      window.open(this.order.url);
      this.init();
    }

    getDatabaseDisplayName(value) {
      const keyToTranslate = 'privateDatabase_dashboard_version_';
      return this.privateDatabaseService.getDatabaseDisplayName(
        keyToTranslate,
        value,
      );
    }
  },
);
