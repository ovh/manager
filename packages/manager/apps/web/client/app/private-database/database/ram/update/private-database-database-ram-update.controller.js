import get from 'lodash/get';
import { PLANS_CAPACITY } from './private-database-database-ram-update.constants';

angular.module('App').controller(
  'PrivateDatabaseChangeRamCtrl',
  class PrivateDatabaseChangeRamCtrl {
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
        provisionalOrder: null,
        availablePlans: true,
      };

      this.data = {
        availablePlans: [],
        ovhSubsidiary: '',
        provisionalOrder: null,
      };

      this.model = {
        planCode: null,
        contract: false,
      };

      this.database = this.$scope.currentActionData;

      this.$scope.sortRam = (planCode) =>
        this.constructor.getCapacityFromPlanCode(planCode);

      this.userService.getUser().then((user) => {
        this.data.ovhSubsidiary = user.ovhSubsidiary;
      });

      /*= =============================
             =            STEP 1            =
             ============================== */
      this.loading.availablePlans = true;

      this.privateDatabaseService
        .getUpgradePlans(this.productId)
        .then((result) => {
          this.loading.availablePlans = false;
          this.data.availablePlans = result.map((e) => e.planCode);
        });

      /*= =============================
             =            STEP 2            =
             ============================== */
      this.$scope.getProvisionalOrder = () => this.getProvisionalOrder();

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

    getProvisionalOrder() {
      this.loading.provisionalOrder = true;

      this.privateDatabaseService
        .getUpgradeProvisionalOrder(this.productId, this.model.planCode)
        .then((response) => {
          this.loading.provisionalOrder = false;
          this.data.provisionalOrder = response;
        });
    }

    loadContracts() {
      this.model.contract = false;
      if (
        !this.data.provisionalOrder.contracts ||
        !this.data.provisionalOrder.contracts.length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 5);
      }
    }

    backToContracts() {
      if (
        !this.data.provisionalOrder.contracts ||
        !this.data.provisionalOrder.contracts.length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 2);
      }
    }

    orderRam() {
      this.loading.validation = true;

      this.$scope.resetAction();

      this.privateDatabaseService
        .upgradeOrder(this.productId, this.model.planCode)
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

    static getCapacityFromPlanCode(planCode) {
      return PLANS_CAPACITY[planCode];
    }
  },
);
