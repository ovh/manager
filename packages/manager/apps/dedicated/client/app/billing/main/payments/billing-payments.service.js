import clone from 'lodash/clone';
import map from 'lodash/map';

export default /* @ngInject */ function BillingPaymentsService(
  $http,
  $q,
  $cacheFactory,
) {
  const billingCache = $cacheFactory('UNIVERS_BILLING_PAYMENTS');
  const batchSeparator = ',';

  this.getPaymentIds = ({
    dateFrom,
    dateTo,
    sort = false,
    paymentType = 0,
  }) => {
    const apiv7Ops = {
      'date:ge': moment(dateFrom)
        .startOf('day')
        .toISOString(),
      'date:le': moment(dateTo)
        .endOf('day')
        .toISOString(),
    };

    if (Array.isArray(paymentType)) {
      apiv7Ops['paymentInfo.paymentType:in'] = paymentType.join(',');
    } else if (String(paymentType) !== '0') {
      apiv7Ops['paymentInfo.paymentType'] = paymentType;
    }

    if (sort && sort.field && sort.order) {
      apiv7Ops.$sort = sort.field;
      apiv7Ops.$order = sort.order;
    }
    return $http
      .get('/me/deposit', {
        params: apiv7Ops,
        cache: billingCache,
        serviceType: 'apiv7',
      })
      .then((response) => response.data);
  };

  this.getPayments = (_ids, limit = 0, offset = 0) => {
    let ids = _ids;

    if (!angular.isArray(ids)) {
      throw new TypeError('Expecting an array of deposit ids.');
    }

    if (offset < ids.length) {
      ids = ids.slice(offset);
    }

    if (limit < ids.length) {
      ids = ids.slice(0, limit);
    }

    // Add an extra batchSeparator in the end of the batch to workaround ENGINE-5479
    const batchIds = encodeURIComponent(
      ids.join(batchSeparator) + batchSeparator,
    );

    return $http
      .get(`/me/deposit/${batchIds}?$batch=${batchSeparator}`, {
        cache: billingCache,
        serviceType: 'apiv7',
      })
      .then((response) => {
        const res = response.data.sort(
          (a, b) => ids.indexOf(a.key) - ids.indexOf(b.key),
        );

        return res.map((item) =>
          item.error
            ? angular.extend({ error: item.error }, item.value)
            : item.value,
        );
      });
  };

  this.getPayment = (id) =>
    $http
      .get(`/me/deposit/${id}`, {
        cache: billingCache,
        serviceType: 'apiv7',
      })
      .then((response) => response.data);

  this.getBillsIds = (id) =>
    $http
      .get(`/me/deposit/${id}/paidBills`, {
        cache: billingCache,
        serviceType: 'apiv7',
      })
      .then((response) => response.data);

  this.getBillDetails = (id, billId) =>
    this.getBill(id, billId).then((bill) =>
      this.getOperationsDetails(id, billId, bill.orderId).then((operations) => {
        const billdetails = clone(bill);
        if (!operations || operations.length === 0) {
          throw new Error('No operation for a bill concerned by a deposit');
        }
        if (operations.length > 1) {
          throw new Error(
            'More than one operation for a bill concerned by a deposit',
          );
        }
        billdetails.payment = operations[0].amount.text;
        return billdetails;
      }),
    );

  this.getBill = (id, billId) =>
    $http
      .get(`/me/deposit/${id}/paidBills/${billId}`, {
        cache: billingCache,
        serviceType: 'apiv7',
      })
      .then((response) => response.data);

  this.getOperationsDetails = (id, billId, orderId) =>
    this.getOperationsIds(id, billId, orderId).then((operationsIds) =>
      $q.all(
        map(operationsIds, (operationId) =>
          this.getOperation(id, billId, operationId),
        ),
      ),
    );

  this.getOperationsIds = (id, billId, orderId) =>
    $http
      .get(`/me/deposit/${id}/paidBills/${billId}/debt/operation`, {
        cache: billingCache,
        serviceType: 'apiv7',
        params: {
          depositOrderId: orderId,
        },
      })
      .then((response) => response.data);

  this.getOperation = (id, billId, operationId) =>
    $http
      .get(
        `/me/deposit/${id}/paidBills/${billId}/debt/operation/${operationId}`,
        {
          cache: billingCache,
          serviceType: 'apiv7',
        },
      )
      .then((response) => response.data);
}
