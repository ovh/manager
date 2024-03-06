import head from 'lodash/head';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import values from 'lodash/values';
import 'moment';

export default class IpLoadBalancerGraphCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    ChartFactory,
    CucControllerHelper,
    IpLoadBalancerConstant,
    IpLoadBalancerMetricsService,
  ) {
    this.$stateParams = $stateParams;
    this.ChartFactory = ChartFactory;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerMetricsService = IpLoadBalancerMetricsService;
  }

  $onInit() {
    this.connLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.getData('conn'),
    });
    this.reqmLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.getData('reqm'),
    });
    this.offerLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerMetricsService.getService(
          this.$stateParams.serviceName,
        ),
    });

    this.initGraph();
    this.loadGraphs();
  }

  initGraph() {
    this.data = {
      datasets: [],
    };
    this.metricsList = this.IpLoadBalancerConstant.graphs;
    const config = {
      data: {
        datasets: [],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            id: 'y-axe',
            type: 'linear',
            min: 0,
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        elements: {
          line: {
            fill: true,
            backgroundColor: '#59d2ef',
            borderColor: '#00a2bf',
            borderWidth: 4,
            tension: 0.5,
          },
          point: {
            radius: 0,
          },
        },
      },
    };

    this.connChart = new this.ChartFactory(config);
    this.reqmChart = new this.ChartFactory(config);
  }

  loadGraphs() {
    this.offerLoader.load().then((service) => {
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
      this.connLoader.load();
      this.reqmLoader.load();
    });
  }

  refreshGraphs() {
    this.connLoader.load();
    this.reqmLoader.load();
  }

  getData(metric) {
    const { downsample } = this.IpLoadBalancerConstant.graphParams[this.scale];
    const downsampleAggregation = this.metric === 'conn' ? 'sum' : 'max';

    return this.IpLoadBalancerMetricsService.getData(metric, this.scale, null, {
      downsample: `${downsample}-${downsampleAggregation}`,
    }).then((data) => {
      if (data.length && data[0].dps) {
        const labels = this.constructor.humanizeLabels(keys(data[0].dps));
        const datasets = [
          {
            data: values(data[0].dps),
          },
        ];
        if (metric === 'conn') {
          this.connChart.data.labels = labels;
          this.connChart.data.datasets = datasets;
        }
        if (metric === 'reqm') {
          this.reqmChart.data.labels = labels;
          this.reqmChart.data.datasets = datasets;
        }
      }
      return {};
    });
  }

  static humanizeLabels(labels) {
    return labels.map((label) =>
      moment(label, 'X').format('MM/DD/YY - HH:mm:ss'),
    );
  }

  onScaleChange() {
    this.refreshGraphs();
  }
}
