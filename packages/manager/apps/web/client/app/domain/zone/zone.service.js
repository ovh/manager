export default class ZoneService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getCapabilities(zoneName) {
    return this.$http
      .get(`/domain/zone/${zoneName}/capabilities`)
      .then(({ data }) => data);
  }

  getDnsFile(url) {
    return this.$http.get(url).then(({ data }) => data);
  }

  restore(zoneName, creationDate) {
    return this.$http
      .post(`/domain/zone/${zoneName}/history/${creationDate}/restore`)
      .then(({ data }) => data);
  }

  /**
   * Get DNS Zone history
   * @param {string} zoneName
   */
  getZoneHistory(zoneName) {
    return this.$http
      .get(`/domain/zone/${zoneName}/history`)
      .then(({ data }) => data);
  }

  /**
   * Get zone data at given date
   * @param {string} zoneName
   * @param {Date} creationDate
   */
  getZoneDataByDate(zoneName, creationDate) {
    return this.$http
      .get(`/domain/zone/${zoneName}/history/${creationDate}`)
      .then(({ data }) => data);
  }
}
