import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import { format } from 'date-fns';

import {
  VPS_MONITORING_CHARTS,
  VPS_MONITORING_PERIODS,
} from './vps-monitoring.constants';

export default class {
  /* @ngInject */
  constructor(
    $http,
    $q,
    $stateParams,
    $translate,
    ChartFactory,
    CucCloudMessage,
    DATEFNS_LOCALE,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.ChartFactory = ChartFactory;
    this.CucCloudMessage = CucCloudMessage;
    this.DATEFNS_LOCALE = DATEFNS_LOCALE;
    this.VPS_MONITORING_PERIODS = VPS_MONITORING_PERIODS;
    this.serviceName = $stateParams.serviceName;

    this.loaders = {
      init: false,
    };
    this.data = {};
    [this.period] = this.VPS_MONITORING_PERIODS;
  }

  $onInit() {
    this.loadMonitoring();
  }

  loadMonitoring() {
    this.loaders.init = true;
    return this.$http
      .get(`/vps/${this.serviceName}/metricsToken`)
      .then(({ data }) => {
        this.charts = VPS_MONITORING_CHARTS.map((chart) => {
          return {
            ...chart,
            config: new this.ChartFactory({
              type: 'line',
              plugins: [ChartDatasourcePrometheusPlugin],
              options: {
                animation: {
                  duration: 0,
                },
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  x: {
                    type: 'time',
                    position: 'bottom',
                    adapters: {
                      date: { locale: this.DATEFNS_LOCALE },
                    },
                    grid: {
                      drawBorder: true,
                      display: false,
                    },
                    time: {
                      displayFormats: {
                        hour: 'Ppp',
                      },
                    },
                  },
                  y: {
                    beginAtZero: true,
                    type: 'linear',
                    display: true,
                    min: chart.min ?? 0,
                    max: chart.max,
                    position: 'left',
                    title: {
                      display: true,
                      text: chart.yTitle,
                    },
                    grid: {
                      drawBorder: false,
                      display: true,
                    },
                  },
                },
                elements: {
                  point: {
                    radius: 0,
                  },
                },
                plugins: {
                  legend: {
                    display: chart.legend.display,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      title(item) {
                        return format(new Date(item[0].raw.x), 'Ppp');
                      },
                    },
                  },
                  'datasource-prometheus': {
                    borderWidth: 1,
                    fill: true,
                    dataSetHook: (datastets) =>
                      datastets.map((ds, i) => ({
                        ...ds,
                        label: this.$translate.instant(chart.legend.labels[i]),
                        backgroundColor: Array.isArray(chart.bgColor)
                          ? chart.bgColor[i]
                          : chart.bgColor,
                        borderColor: Array.isArray(chart.borderColor)
                          ? chart.borderColor[i]
                          : chart.borderColor,
                      })),
                    findInBackgroundColorMap: () => chart.bgColor,
                    findInBorderColorMap: () => chart.borderColor,
                    loadingMsg: {
                      message: this.$translate.instant(
                        'vps_monitoring_loading_data',
                      ),
                    },
                    errorMsg: {
                      message: this.$translate.instant(
                        'vps_monitoring_data_none',
                      ),
                    },
                    noDataMsg: {
                      message: this.$translate.instant(
                        'vps_monitoring_data_none',
                      ),
                    },
                    query: chart.queries(this.serviceName).map((query) => {
                      return async (start, end, step) => {
                        const url = `${
                          data.endpoint
                        }/prometheus/api/v1/query_range?query=${query}&start=${start.toISOString()}&end=${end.toISOString()}&step=${step}`;

                        const headers = {
                          authorization: `bearer ${data.token}`,
                          'content-type': 'application/x-www-form-urlencoded',
                        };

                        return fetch(url, { headers })
                          .then((response) => {
                            if (response.ok) {
                              return response.json();
                            }

                            if (response.status === 403) {
                              return this.loadMonitoring();
                            }

                            return null;
                          })
                          .then((response) => response.data)
                          .catch(() => {});
                      };
                    }),

                    timeRange: {
                      type: 'relative',
                      // Period
                      start: this.period.timeRange,
                      end: 0,
                    },
                  },
                },
              },
            }),
          };
        });
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }
}
