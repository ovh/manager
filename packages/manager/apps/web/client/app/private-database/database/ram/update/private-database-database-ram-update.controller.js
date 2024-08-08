import get from 'lodash/get';

angular.module('App').controller(
  'PrivateDatabaseChangeRamCtrl',
  class PrivateDatabaseChangeRamCtrl {
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
        ram: null,
        duration: null,
        contract: false,
      };

      this.database = this.$scope.currentActionData;

      this.$scope.sortRam = (element) => +element.capacity;

      this.userService.getUser().then((user) => {
        this.data.ovhSubsidiary = user.ovhSubsidiary;
      });

      /*= =============================
       =            STEP 1            =
       ============================== */
      this.loading.availableRam = true;

      this.privateDatabaseService
        .getUpgradePlans(this.productId)
        .then((results) => {
          results.forEach((plan) => {
            const capacity = parseInt(plan.planCode.match(/\d+/)?.[0], 10);

            if (
              this.database.infrastructure !== 'legacy' ||
              capacity !== 2048 ||
              +capacity !== +this.database.ram.value
            ) {
              this.data.availableRam.push({
                capacity,
                planCode: plan.planCode,
              });
            }
          });
        })
        .catch((err) => {
          this.alerter.alertFromSWS(
            this.$translate.instant(
              'privateDatabase_order_RAM_step1_loading_error',
            ),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.availableRam = false;
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
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { price: price.text });
    }

    getDurations() {
      this.loading.durations = true;

      this.privateDatabaseService
        .getRamPlan(this.productId, this.model.ram.planCode)
        .then((order) => {
          this.loading.durations = false;

          const { description } = order.details.find(({ detailType }) => {
            return detailType === 'DURATION';
          });

          this.data.durations.available = [
            {
              prices: order.prices,
              description,
              details: order.details,
              contracts: order.contracts,
            },
          ];
        });
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
        .orderRam(this.productId, this.model.ram.planCode)
        .then((order) => {
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_order_RAM_finish_success',
              {
                t0: order.url,
              },
            ),
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
  },
);
