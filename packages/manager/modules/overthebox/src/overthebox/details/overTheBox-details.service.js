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
}
