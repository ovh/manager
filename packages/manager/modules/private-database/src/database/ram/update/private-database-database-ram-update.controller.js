import angular from 'angular';
import get from 'lodash/get';
import remove from 'lodash/remove';

export default class PrivateDatabaseChangeRamCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    PrivateDatabase,
    WucUser,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.privateDatabaseService = PrivateDatabase;
    this.userService = WucUser;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;

    this.loading = {
      durations: null,
      availableRam: true,
    };

    this.data = {
      availableRam: [],
      durations: {
        available: [],
        details: {},
      },
      ovhSubsidiary: '',
    };

    this.model = {
      capacity: null,
      duration: null,
      contract: false,
    };

    this.database = this.$scope.currentActionData;

    this.$scope.sortRam = (ram) => +ram;

    this.userService.getUser().then((user) => {
      this.data.ovhSubsidiary = user.ovhSubsidiary;
    });

    /*= =============================
             =            STEP 1            =
             ============================== */
    this.loading.availableRam = true;

    this.privateDatabaseService.listAvailableRam().then((availableRam) => {
      this.loading.availableRam = false;
      this.data.availableRam = availableRam;
      if (this.database.infrastructure === 'legacy') {
        remove(this.data.availableRam, (ram) => ram === '2048');
      }

      remove(
        this.data.availableRam,
        (ram) => +ram === +this.database.ram.value,
      );
    });

    /*= =============================
             =            STEP 2            =
             ============================== */
    this.$scope.getDurations = () => this.getDurations();

    /*= =============================
             =            STEP 3            =
             ============================== */
    this.$scope.loadContracts = () => this.loadContracts();

    this.$scope.backToContracts = () => this.backToContracts();

    /*= =============================
             =            STEP 4            =
             ============================== */

    this.$scope.orderRam = () => this.orderRam();
  }

  getResumePrice(price) {
    return price.value === 0
      ? this.$translate.instant('private_database_database_price_free')
      : this.$translate.instant('private_database_database_price_ht_label', {
          price: price.text,
        });
  }

  getDurations() {
    this.loading.durations = true;

    this.privateDatabaseService
      .getRamPrices(this.productId, {
        ram: this.model.capacity,
      })
      .then(
        (durations) => {
          this.loading.durations = false;
          this.data.durations.available = durations;
        },
        angular.noop,
        (duration) => {
          this.data.durations.available = duration;
        },
      );
  }

  loadContracts() {
    this.model.contract = false;
    if (
      !this.model.duration.contracts ||
      !this.model.duration.contracts.length
    ) {
      this.$rootScope.$broadcast('wizard-goToStep', 5);
    }
  }

  backToContracts() {
    if (
      !this.model.duration.contracts ||
      !this.model.duration.contracts.length
    ) {
      this.$rootScope.$broadcast('wizard-goToStep', 2);
    }
  }

  orderRam() {
    this.loading.validation = true;

    this.$scope.resetAction();

    this.privateDatabaseService
      .orderRam(
        this.productId,
        this.model.capacity,
        this.model.duration.duration,
      )
      .then((order) => {
        this.alerter.success(
          this.$translate.instant('privateDatabase_order_RAM_finish_success', {
            t0: order.url,
          }),
          this.$scope.alerts.main,
        );
        window.open(order.url, '_blank');
      })
      .catch((err) => {
        this.alerter.alertFromSWS(
          this.$translate.instant('privateDatabase_order_RAM_finish_error'),
          get(err, 'data', err),
        );
      })
      .finally(() => {
        this.loading.validation = false;
      });
  }

  static isProrataDuration({ duration }) {
    return /^upto/.test(duration);
  }
}
