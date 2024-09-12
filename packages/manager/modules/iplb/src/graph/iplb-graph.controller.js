import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import keys from 'lodash/keys';
import head from 'lodash/head';
import reduce from 'lodash/reduce';

export default class IpLoadBalancerGraphCtrl {
  /* @ngInject */
  constructor(
    $http,
    $stateParams,
    ChartFactory,
    IpLoadBalancerConstant,
    IpLoadBalancerMetricsService,
  ) {
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.ChartFactory = ChartFactory;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerMetricsService = IpLoadBalancerMetricsService;
    this.charts = {};
    this.serviceName = this.$stateParams.serviceName;
  }

  $onInit() {
    return this.loadScales().then(() => {
      this.initGraph();
    });
  }

  initGraph() {
    this.loadingGraph = true;
    const titles = {
      conn: 'iplb_graph_connections_title',
      reqm: 'iplb_graph_rqpersec_title',
    };
    const queries = {
      conn: `sum(rate(haproxy_process_connections_total{servicename="${
        this.serviceName
      }"}[${this.scales[this.scale].rateInterval}])) `,
      reqm: `sum(rate(haproxy_process_requests_total{servicename="${
        this.serviceName
      }"}[${this.scales[this.scale].rateInterval}])) `,
    };

    return this.$http
      .get(`/ipLoadbalancing/${this.serviceName}/metricsToken`)
      .then((data) => {
        const { endpoint, token } = data.data;
        const backgroundColor = '#59d2ef';
        const borderColor = '#3DD1F0';

        this.IpLoadBalancerConstant.graphs.forEach((g) => {
          this.charts[g] = {
            title: titles[g],
            config: new this.ChartFactory({
              type: 'line',
              plugins: [ChartDatasourcePrometheusPlugin],
              options: {
                animation: {
                  duration: 0,
                },
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  'datasource-prometheus': {
                    borderWidth: 4,
                    fill: true,
                    findInBackgroundColorMap: () => backgroundColor,
                    findInBorderColorMap: () => borderColor,
                    tension: 0.5,
                    query: (start, end, step) => {
                      const url = `${endpoint}/prometheus/api/v1/query_range?query=${
                        queries[g]
                      }&start=${start.toISOString()}&end=${end.toISOString()}&step=${step}`;

                      const headers = {
                        authorization: `bearer ${token}`,
                        'content-type': 'application/x-www-form-urlencoded',
                      };

                      return fetch(url, { headers })
                        .then((response) => {
                          if (response.ok) {
                            return response.json();
                          }

                          return null;
                        })
                        .then((response) => response.data);
                    },
                    timeRange: {
                      type: 'relative',
                      start: this.scales[this.scale].timeRange,
                      end: 0,
                      step: this.scales[this.scale].step,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      min: 0,
                      minStep: 1,
                    },
                  },
                },
                elements: {
                  point: {
                    radius: 0,
                  },
                },
              },
            }),
          };
        });
      })
      .finally(() => {
        this.loadingGraph = false;
      });
  }

  loadScales() {
    return this.IpLoadBalancerMetricsService.getService(this.serviceName).then(
      (service) => {
        let scales = this.IpLoadBalancerConstant.graphScales[service.offer];
        if (!scales) {
          scales = this.IpLoadBalancerConstant.graphScales.lb1;
        }
        this.scales = reduce(
          scales,
          (scalesParam, scale) => {
            // eslint-disable-next-line no-shadow
            const scales = scalesParam;
            scales[scale] = this.IpLoadBalancerConstant.graphParams[scale];
            return scales;
          },
          {},
        );
        this.scale = head(keys(this.scales));
      },
    );
  }

  onScaleChange() {
    this.initGraph();
  }
}
