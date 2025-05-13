export default class LogsStreamsSubscriptionsService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  /**
   * Retrieve list of stream's subscription with pagination, sorts, filters etc.
   * @param serviceName string LDP service name
   * @param streamId string LDP stream UUID
   * @param offset int Offset to start from
   * @param pageSize int Number of results to retrieve from API
   * @param sort string Name of field to sort from
   * @param filters Array List of Iceberg filters to apply
   * @return {Object}
   */
  getPaginatedStreamSubscriptions(
    serviceName,
    streamId,
    offset = 0,
    pageSize = 25,
    sort = { name: 'nbArchive', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/subscription`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    return res.execute().$promise.then((response) => ({
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  /**
   * Delete a subscription on the API side
   * @param serviceName string LDP service name
   * @param streamId string LDP stream UUID
   * @param subscription Object Subscription object to delete
   * @return {Promise<any>}
   */
  deleteSubscription(serviceName, streamId, subscription) {
    return this.$http.delete(
      `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}/subscription/${subscription.subscriptionId}`,
    );
  }
}
