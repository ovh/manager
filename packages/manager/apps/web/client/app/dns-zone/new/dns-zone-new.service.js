export default
class newDnsZone {
  /**
     * Constructor
     * @param $http
     * @param $q
     */
  /* @ngInject */
  constructor(
    $http,
    $q,
  ) {
    this.$http = $http;
    this.$q = $q;

    this.swsProxypassOrderPath = 'apiv6/order/domain/zone';
  }

  /**
     * Get zoneName Validation Response
     * @param zoneName
     */
  getZoneNameValidation(zoneName) {
    return this.$http
      .get(`${this.swsProxypassOrderPath}/new`, {
        params: {
          zoneName,
        },
      })
      .then(response => response.data)
      .catch(err => this.$q.reject(err));
  }

  /**
     * Order a new ZoneName (DNS)
     * @param zoneName
     * @param minimized
     */
  orderZoneName(zoneName, minimized) {
    return this.$http
      .post(`${this.swsProxypassOrderPath}/new`, {
        zoneName,
        minimized,
      })
      .then(response => response.data)
      .catch(err => this.$q.reject(err.data));
  }
}
