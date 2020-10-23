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

  /* -----  End of API CALLS  ------ */
}
