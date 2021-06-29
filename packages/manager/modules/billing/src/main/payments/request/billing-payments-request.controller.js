import find from 'lodash/find';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import set from 'lodash/set';

export default class BillingHistoryRequestCtrl {
  /* @ngInject */
  constructor($q, $state, OvhApiMe, BillingBill, Alerter) {
    this.$q = $q;
    this.$state = $state;
    this.OvhApiMe = OvhApiMe;
    this.BillingBill = BillingBill;
    this.Alerter = Alerter;

    this.bills = null;
    this.requestPending = true;

    this.loading = {
      init: false,
    };
  }

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  $onInit() {
    let requestOrderIds = [];
    let orderBillIds = [];
    const depositRequests = [];
    this.loading.init = true;

    return this.OvhApiMe.DepositRequest()
      .v6()
      .query()
      .$promise.then((depositRequestIds) => {
        if (!depositRequestIds.length) {
          this.requestPending = false;
          return null;
        }

        const depositRequestPromises = [];
        depositRequestIds.forEach((depositRequestId) => {
          depositRequestPromises.push(
            this.OvhApiMe.DepositRequest()
              .v6()
              .get({
                id: depositRequestId,
              })
              .$promise.then((depositRequest) => {
                depositRequests.push(depositRequest);
                requestOrderIds = requestOrderIds.concat(
                  depositRequest.orderIds,
                );
              }),
          );
        });

        return this.$q.all(depositRequestPromises).then(() => {
          const billPromises = [];

          requestOrderIds.forEach((requestOrderId) => {
            billPromises.push(
              this.OvhApiMe.Bill()
                .v6()
                .query({
                  orderId: requestOrderId,
                })
                .$promise.then((billIds) => {
                  orderBillIds = orderBillIds.concat(billIds);
                }),
            );
          });

          return this.$q.all(billPromises).then(() =>
            this.BillingBill.getById({
              $batch: ',',
              billId: orderBillIds.join(','),
            }).$promise.then((bills) => {
              this.bills = map(bills, (bill) => {
                set(
                  bill,
                  'value.paid',
                  (
                    find(
                      depositRequests,
                      (depositRequest) =>
                        indexOf(depositRequest.orderIds, bill.value.orderId) >
                        -1,
                    ) || {}
                  ).creationDate,
                );
                return bill;
              });
            }),
          );
        });
      })
      .catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('billing_payment_request_load_error'),
          {
            message: get(error, 'data.message'),
            type: 'ERROR',
          },
          'billing_payment_request',
        );
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------ */
}
