export default class SmsStatisticsService {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  /**
   * Get outgoing SMS with date filters using iceberg for efficient querying
   * @param {string} serviceName - The SMS service name
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Promise} List of outgoing SMS
   */
  getOutgoingSms(serviceName, from, to) {
    return this.iceberg(`/sms/${serviceName}/outgoing`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(50000) // if not limited, default limit is 1000 by default, isn't enough for statistics
      .execute({
        'creationDatetime.from': from.toISOString(),
        'creationDatetime.to': to.toISOString(),
      })
      .$promise.then(({ data }) => data || []);
  }

  /**
   * Get incoming SMS with date filters using iceberg for efficient querying
   * @param {string} serviceName - The SMS service name
   * @param {Date} from - Start date
   * @param {Date} to - End date
   * @returns {Promise} List of incoming SMS
   */
  getIncomingSms(serviceName, from, to) {
    return this.iceberg(`/sms/${serviceName}/incoming`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(50000) // if not limited, default limit is 1000 by default, isn't enough for statistics
      .execute({
        'creationDatetime.from': from.toISOString(),
        'creationDatetime.to': to.toISOString(),
      })
      .$promise.then(({ data }) => data || []);
  }

  /**
   * Get batch statistics
   * @param {string} serviceName - The SMS service name
   * @param {string} batchId - The batch ID
   * @returns {Promise} Batch statistics data
   */
  getBatchStatistics(serviceName, batchId) {
    return this.$http
      .get(`/sms/${serviceName}/batches/${batchId}/statistics`)
      .then(({ data }) => data);
  }
}
