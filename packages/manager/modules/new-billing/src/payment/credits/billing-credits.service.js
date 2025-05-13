export default class BillingCreditsService {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  /* ================================
    =            API CALLS            =
    ================================= */

  /* ----------  Balance API calls  ---------- */

  queryBalance() {
    return this.OvhHttp.get('/me/credit/balance', {
      rootPath: 'apiv6',
    });
  }

  getBalance(balanceName) {
    return this.OvhHttp.get(`/me/credit/balance/${balanceName}`, {
      rootPath: 'apiv6',
    });
  }

  /* ----------  Balance movements API calls  ---------- */

  queryBalanceMovements(balanceName) {
    return this.OvhHttp.get(`/me/credit/balance/${balanceName}/movement`, {
      rootPath: 'apiv6',
    });
  }

  getBalanceMovement(balanceName, movementId) {
    return this.OvhHttp.get(
      `/me/credit/balance/${balanceName}/movement/${movementId}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  getOrder(orderId) {
    return this.OvhHttp.get(`/me/order/${orderId}`, {
      rootPath: 'apiv6',
    });
  }

  getRefund(refundId) {
    return this.OvhHttp.get(`/me/refund/${refundId}`, {
      rootPath: 'apiv6',
    });
  }

  /* -----  End of API CALLS  ------ */
}
