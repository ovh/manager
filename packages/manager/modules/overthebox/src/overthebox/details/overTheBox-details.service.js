import 'moment';

export default class OverTheBoxDetailsService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  loadStatistics(serviceName, metricsType, period) {
    const options = {
      period,
      metricsType,
    };

    return this.$http
      .get(`/overTheBox/${serviceName}/statistics`, { params: options })
      .then((statistics) => {
        const stats = statistics.data || [];
        return stats;
      })
      .catch(() => []);
  }

  getDeviceHardware(serviceName) {
    return this.$http
      .get(`/overTheBox/${serviceName}/device/hardware`)
      .then(({ data }) => data);
  }

  unlinkDevice(serviceName) {
    return this.$http.delete(`/overTheBox/${serviceName}/device`);
  }
}
