export default /* @ngInject */ function BillingPaymentsRequestService(iceberg) {
  function fetchDepositRequests() {
    return iceberg('/me/depositRequest')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }

  function fetchBills(depositRequests) {
    if (!depositRequests.length) return { depositRequests, bills: [] };

    const orderIdFilter = depositRequests.reduce(
      (list, { orderIds }) => [...list, ...orderIds],
      [],
    );

    return iceberg('/me/bill')
      .query()
      .expand('CachedObjectList-Pages')
      .addFilter('orderId', 'in', orderIdFilter)
      .limit(orderIdFilter.length)
      .execute()
      .$promise.then(({ data: bills }) => ({ depositRequests, bills }));
  }

  function formatResponse({ depositRequests, bills }) {
    return {
      depositRequests,
      bills: bills.map((bill) => ({
        ...bill,
        paid: depositRequests.find(
          ({ orderIds }) => orderIds.indexOf(bill.orderId) >= 0,
        )?.creationDate,
      })),
    };
  }

  this.fetch = () =>
    fetchDepositRequests()
      .then(fetchBills)
      .then(formatResponse);
}
