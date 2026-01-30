export default class BillingVoipConsumptionsService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getBillingAccount({ offset, criteria, pageSize, sort }) {
    let res = this.iceberg('/telephony')
      .query()
      .expand('CachedObjectList-Pages')
      .offset(Math.ceil(offset / pageSize))
      .limit(pageSize)
      .sort(sort.property, sort.dir === 1 ? 'ASC' : 'DESC');

    criteria.forEach(({ property, operator, value }) => {
      res = res.addFilter(property || 'description', ...{
        bigger: ['gt', value],
        contains: ['like', `%${value}%`],
        containsNot: ['nlike', `%${value}%`],
        endsWith: ['like', `%${value}`],
        is: ['eq', value],
        isAfter: ['gt', value],
        isBefore: ['lt', value],
        isNot: ['nq', value],
        smaller: ['lt', value],
        startsWith: ['like', `${value}%`],
      }[operator]);
    });

    return res.execute().$promise.then((response) => ({
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
        currentOffset: offset,
        pageCount: Math.ceil(parseInt(response.headers['x-pagination-elements'], 10) / pageSize),
      },
    }));
  }

  getHistoryConsumption(billingAccount) {
    return this.iceberg(`/telephony/${billingAccount}/historyConsumption`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }

  getHistoryConsumptionFile(billingAccount, date, params) {
    return this.$http.get(`/telephony/${billingAccount}/historyConsumption/${date}/file`, { params }).then(({ data }) => data);
  }
}
