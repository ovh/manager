import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';

export default class BillingHistoryDebtDetailsCtrl {
  /* @ngInject */
  constructor($q, $state, $stateParams, $translate, OvhApiMe, Alerter) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiMe = OvhApiMe;
    this.Alerter = Alerter;

    this.bill = null;
    this.order = null;

    this.loading = {
      init: false,
    };

    this.operations = [];
  }

  getOperations() {
    return this.OvhApiMe.DebtAccount()
      .Debt()
      .Operation()
      .v6()
      .query({
        debtId: this.$stateParams.debtId,
      })
      .$promise.then((operationIds) => this.getOperationsDetails(operationIds));
  }

  getOperationsDetails(operationIds) {
    return this.$q
      .all(
        map(chunk(operationIds, 50), (chunkIds) =>
          this.OvhApiMe.DebtAccount()
            .Debt()
            .Operation()
            .v6()
            .getBatch({
              debtId: this.$stateParams.debtId,
              operationId: chunkIds,
            })
            .$promise.then((results) => filter(results, ({ error }) => !error)),
        ),
      )
      .then((resources) => map(flatten(resources), 'value'));
  }

  getBill(orderId) {
    return this.OvhApiMe.Order()
      .v6()
      .associatedObject({
        orderId,
      })
      .$promise.then((associatedObject) => {
        if (associatedObject.type === 'Bill') {
          return this.OvhApiMe.Bill()
            .v6()
            .get({
              billId: associatedObject.id,
            }).$promise;
        }

        return null;
      });
  }

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    this.loading.init = true;

    return this.$q
      .all({
        debt: this.OvhApiMe.DebtAccount()
          .Debt()
          .v6()
          .get({
            debtId: this.$stateParams.debtId,
          }).$promise,
        operations: this.getOperations(),
      })
      .then((results) => {
        this.operations = results.operations;

        return this.$q
          .all({
            order: this.OvhApiMe.Order()
              .v6()
              .get({
                orderId: results.debt.orderId,
              }).$promise,
            bill: this.getBill(results.debt.orderId),
          })
          .then((details) => {
            this.order = details.order;
            this.bill = details.bill;
          });
      })
      .catch((error) => {
        this.Alerter.error(
          [
            this.$translate.instant('billing_history_details_load_error'),
            get(error, 'message'),
          ].join(' '),
          'billing_main_alert',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
