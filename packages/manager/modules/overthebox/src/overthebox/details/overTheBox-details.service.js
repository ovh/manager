import 'moment';

export default /* @ngInject */ function ($http) {
  this.getGraphData = function getGraphData(opts) {
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
        start: moment().subtract(1, 'days').unix() * 1000,
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
    return $http(req);
  };
}
