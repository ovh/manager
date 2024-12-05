export default class BillingPaymentsService {
  /* @ngInject */
  constructor($http, $q, iceberg) {
    this.$http = $http;
    this.$q = $q;
    this.iceberg = iceberg;
  }

  getPayment(id) {
    return this.$http
      .get(`/me/deposit/${id}`)
      .then((response) => response.data);
  }

  getBills(id, { offset, pageSize }) {
    return this.iceberg(`/me/deposit/${id}/paidBills`)
      .query()
      .expand('CachedObjectList-Pages')
      .offset(offset || 1)
      .limit(pageSize)
      .execute()
      .$promise.then((response) => ({
        data: response.data,
        meta: {
          totalCount:
            parseInt(response.headers['x-pagination-elements'], 10) || 0,
        },
      }));
  }

  getBillDetails(id, bill) {
    return this.getOperationsDetails(id, bill.billId, bill.orderId).then(
      (operations) => {
        if (!operations || operations.length === 0) {
          throw new Error('No operation for a bill concerned by a deposit');
        }
        if (operations.length > 1) {
          throw new Error(
            'More than one operation for a bill concerned by a deposit',
          );
        }
        return {
          ...bill,
          payment: operations[0].amount.text,
        };
      },
    );
  }

  getBill(id, billId) {
    return this.$http
      .get(`/me/deposit/${id}/paidBills/${billId}`)
      .then((response) => response.data);
  }

  getOperationsDetails(id, billId, orderId) {
    return this.iceberg(
      `/me/deposit/${id}/paidBills/${billId}/debt/operation`,
      {
        depositOrderId: orderId,
      },
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then((response) => response.data);
  }
}
