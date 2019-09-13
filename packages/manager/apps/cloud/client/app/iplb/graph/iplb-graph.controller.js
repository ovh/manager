class IpLoadBalancerGraphCtrl {
  constructor($stateParams, CucControllerHelper, IpLoadBalancerConstant,
    IpLoadBalancerMetricsService, moment) {
    this.$stateParams = $stateParams;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerConstant = IpLoadBalancerConstant;
    this.IpLoadBalancerMetricsService = IpLoadBalancerMetricsService;
    this.moment = moment;
  }

  $onInit() {
    this.connLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.getData('conn'),
    });
    this.reqmLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.getData('reqm'),
    });
    this.offerLoader = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerMetricsService
        .getService(this.$stateParams.serviceName),
    });

    this.initGraph();
    this.loadGraphs();
  }

  initGraph() {
    this.data = {};
    this.metricsList = this.IpLoadBalancerConstant.graphs;
    this.options = {
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          id: 'y-axe',
          type: 'linear',
          ticks: {
            min: 0,
            beginAtZero: true,
          },
        }],
      },
      elements: {
        line: {
          fill: 'bottom',
          backgroundColor: '#59d2ef',
          borderColor: '#00a2bf',
          borderWidth: 4,
        },
        point: {
          radius: 0,
        },
      },
    };
  }

  loadGraphs() {
    this.offerLoader.load().then((service) => {
      let scales = this.IpLoadBalancerConstant.graphScales[service.offer];
      if (!scales) {
        scales = this.IpLoadBalancerConstant.graphScales.lb1;
      }
      this.scales = _.reduce(scales, (scalesParam, scale) => {
        const scales = scalesParam; // eslint-disable-line
        scales[scale] = this.IpLoadBalancerConstant.graphParams[scale];
        return scales;
      }, {});
      this.scale = _.first(_.keys(this.scales));
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
    })
      .then((data) => {
        if (data.length && data[0].dps) {
          return {
            data: {
              data: _.values(data[0].dps),
              labels: this.humanizeLabels(_.keys(data[0].dps)),
            },
          };
        }
        return {};
      });
  }

  humanizeLabels(labels) {
    return labels.map(label => this.moment(label, 'X').format('MM/DD/YY - HH:mm:ss'));
  }

  onScaleChange() {
    this.refreshGraphs();
  }
}

angular.module('managerApp').controller('IpLoadBalancerGraphCtrl', IpLoadBalancerGraphCtrl);
