export default /* @ngInject */ function BillingCorrectiveInvoices(iceberg) {
  this.getCorrectiveInvoices = () =>
    iceberg('/me/correctiveInvoice')
      .query()
      .expand('CachedObjectList-Pages')
      .sort('date', 'DESC')
      .execute()
      .$promise.then(({ data }) => data);
}
