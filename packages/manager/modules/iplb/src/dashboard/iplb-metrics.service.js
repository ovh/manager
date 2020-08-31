import assign from 'lodash/assign';

export default class IpLoadBalancerMetricsService {
  /* @ngInject */
  constructor(
    $http,
    $stateParams,
    $translate,
    OvhApiIpLoadBalancing,
    IpLoadBalancerConstant,
  ) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.url = IpLoadBalancerConstant.metricsUrl;
    this.path = 'query';

    this.appMetricsQueries = {
      conn: {
        queries: [
          {
            metric: 'haproxy.stats.stot.rate.max',
            aggregator: 'sum',
          },
        ],
      },
      reqm: {
        queries: [
          {
            metric: 'haproxy.stats.req_tot.rate.max',
            aggregator: 'max',
          },
        ],
      },
    };
  }

  getService(serviceName) {
    return this.IpLoadBalancing.v6().get({ serviceName }).$promise;
  }

  getToken() {
    return this.IpLoadBalancing.v6()
      .get({
        serviceName: this.$stateParams.serviceName,
      })
      .$promise.then((details) => details.metricsToken);
  }

  getData(metric, start, end, options) {
    const { queries } = this.appMetricsQueries[metric];
    const apiQuery = {
      start,
      end,
      queries,
    };

    queries.forEach((query) => {
      assign(query, options);
    });

    return this.getToken()
      .then((token) =>
        this.$http({
          method: 'POST',
          url: [this.url, this.path].join('/'),
          headers: {
            Authorization: `Basic ${btoa(`iplb:${token}`)}`,
          },
          preventLogout: true,
          data: JSON.stringify(apiQuery),
        }),
      )
      .then((response) => response.data);
  }
}
