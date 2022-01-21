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

  getGraphData(opts) {
    const req = {
      method: 'POST',
      serviceType: 'opentsdb',
      preventLogout: true,
      url: `https://${opts.service.graphEndpoint.host}/api/query`,
      headers: {
        Authorization: `Basic ${btoa(
          `${opts.service.graphEndpoint.readTokenID}:${opts.service.graphEndpoint.readToken}`,
        )}`,
      },
      data: JSON.stringify({
        start:
          moment()
            .subtract(1, 'days')
            .unix() * 1000,
        queries: [
          {
            metric: 'linux.net.bytes',
            aggregator: 'avg',
            rate: true,
            downSample: opts.downSample,
            rateOptions: { counter: false },
            tags: {
              direction: opts.direction,
              iface: '*',
              serviceName: opts.service.serviceName,
            },
          },
        ],
      }),
    };
    return this.$http(req);
  }
}
