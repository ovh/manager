import get from 'lodash/get';
import set from 'lodash/set';

export default class BillingCreditsCtrl {
  /* @ngInject */
  constructor($q, $stateParams, $translate, Alerter, BillingCredits) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.billingCredits = BillingCredits;

    this.balance = null;
    this.movements = null;
    this.paginatedMovements = [];

    // for pagination-front
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.nbPages = null;

    this.loading = {
      init: false,
      getMovement: false,
    };
  }

  /* =======================================
    =            PAGINATION FRONT            =
    ======================================== */

  getMovementDetails(movementId) {
    this.loading.getMovement = true;

    return this.billingCredits
      .getBalanceMovement(this.$stateParams.balanceName, movementId)
      .catch((error) => {
        this.Alerter.set(
          'alert-danger',
          [
            this.$translate.instant(
              'billing_credit_balance_movements_load_error',
            ),
            get(error, 'message'),
          ].join(' '),
        );
      });
  }

  pushMovementDetails(movementDetails) {
    set(
      movementDetails,
      'expireSoon',
      movementDetails.expirationDate
        ? moment(movementDetails.expirationDate).diff(moment(), 'days') <= 7
        : false,
    );
    this.paginatedMovements.push(movementDetails);
  }

  onDetailsDone() {
    this.loading.getMovement = false;
  }

  /* -----  End of PAGINATION FRONT  ------ */

  /* ================================
    =            API CALLS            =
    ================================= */

  getBalance() {
    return this.billingCredits
      .getBalance(this.$stateParams.balanceName)
      .then((balance) => {
        this.balance = balance;
      })
      .catch((error) => {
        this.Alerter.set(
          'alert-danger',
          [
            this.$translate.instant(
              'billing_credit_balance_movements_load_error',
            ),
            get(error, 'message'),
          ].join(' '),
        );
      });
  }

  getBalanceMovements() {
    return this.billingCredits
      .queryBalanceMovements(this.$stateParams.balanceName)
      .then((movements) => {
        this.movements = movements;
      })
      .catch((error) => {
        this.Alerter.set(
          'alert-danger',
          [
            this.$translate.instant(
              'billing_credit_balance_movements_load_error',
            ),
            get(error, 'message'),
          ].join(' '),
        );
      });
  }

  /* -----  End of API CALLS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.$q
      .all([this.getBalance(), this.getBalanceMovements()])
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
