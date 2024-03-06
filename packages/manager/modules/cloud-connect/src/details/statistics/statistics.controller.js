import get from 'lodash/get';
import map from 'lodash/map';

import {
  LABELS,
  PERIOD,
  PERIOD_ENUM,
  STATISTICS,
  TYPE,
  TYPE_ENUM,
  TYPE_LABELS,
} from './statistics.constant';

export default class CloudConnectStatisticsCtrl {
  /* @ngInject */
  constructor($q, ChartFactory, CucCloudMessage, cloudConnectService) {
    this.$q = $q;
    this.ChartFactory = ChartFactory;
    this.CucCloudMessage = CucCloudMessage;
    this.cloudConnectService = cloudConnectService;
    this.LABELS = LABELS;
    this.PERIOD = PERIOD;
    this.STATISTICS = STATISTICS;
    this.TYPE = TYPE;
    this.TYPE_LABELS = TYPE_LABELS;
  }

  $onInit() {
    this.periodOptions = PERIOD_ENUM;
    this.typeOptions = TYPE_ENUM;

    this.graphType = this.TYPE.TRAFFIC;
    this.graphPeriod = this.PERIOD.DAILY;

    this.trafficLoader = {
      series: [],
      data: [],
    };

    this.displayedGraph = this.TYPE.TRAFFIC;
    this.colors = this.STATISTICS.colors;
    this.chart = new this.ChartFactory({
      ...this.STATISTICS.options,
    });

    this.isLoading = false;
    this.loadGraphs();
  }

  loadGraphs() {
    switch (this.graphType) {
      case this.TYPE.LIGHT:
        this.displayedGraph = this.TYPE.LIGHT;
        this.loadLightGraph();
        break;
      case this.TYPE.ERROR:
        this.loadErrorGraph();
        this.displayedGraph = this.TYPE.ERROR;
        break;
      default:
        this.loadTrafficGraph();
        this.displayedGraph = this.TYPE.TRAFFIC;
        break;
    }
  }

  loadInterfacesStatistics(type) {
    let propDown = '';
    let propUp = '';
    switch (type) {
      case this.TYPE.LIGHT:
        propDown = this.TYPE.LIGHT_IN;
        propUp = this.TYPE.LIGHT_OUT;
        break;
      case this.TYPE.ERROR:
        propDown = this.TYPE.ERROR_DOWN;
        propUp = this.TYPE.ERROR_UP;
        break;
      default:
        propDown = this.TYPE.TRAFFIC_DOWN;
        propUp = this.TYPE.TRAFFIC_UP;
        break;
    }

    this.cloudConnect.interfaceList.forEach((interfaceId) => {
      return this.$q
        .all({
          down: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            propDown,
            this.graphPeriod,
          ),
          up: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            propUp,
            this.graphPeriod,
          ),
        })
        .then((stats) => {
          if (stats.down.length > 0 || stats.up.length > 0) {
            this.updateStats(type, interfaceId, stats);
            this.isLoading = false;
          }
        });
    });
  }

  // Load error statistics
  loadErrorGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    // Update options
    this.chart.options.scales.y.title.text = this.LABELS.error_unit;

    this.loadInterfacesStatistics(this.TYPE.ERROR);
  }

  // Load light statistics
  loadLightGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    // Update options
    this.chart.options.scales.y.title.text = this.LABELS.light_unit;

    this.loadInterfacesStatistics(this.TYPE.LIGHT);
  }

  // Load traffic statistics
  loadTrafficGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    // Update options
    this.chart.options.scales.y.title.text = this.LABELS.traffic_unit;

    this.loadInterfacesStatistics(this.TYPE.TRAFFIC);
  }

  updateStats(type, interfaceId, stats) {
    let serieLabels = null;
    const dataProperties = [this.TYPE_LABELS.down, this.TYPE_LABELS.up];
    switch (type) {
      case this.TYPE.LIGHT:
        serieLabels = [
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.in}`,
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.out}`,
        ];
        break;
      case this.TYPE.ERROR:
        serieLabels = [
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.download}`,
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.upload}`,
        ];
        break;
      default:
        serieLabels = [
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.download}`,
          `${this.LABELS.id_port} ${interfaceId} - ${this.LABELS.upload}`,
        ];
        break;
    }
    this.chart.data.labels = map(
      get(stats, dataProperties[0]),
      (value) => value[0],
    );

    dataProperties.forEach((prop) => {
      this.data.push(map(get(stats, prop), (value) => value[1].value));
    });

    this.chart.data.datasets = dataProperties.map((prop, i) => ({
      label: serieLabels[i],
      data: map(get(stats, prop), (value) => value[1].value),
      borderColor: this.colors[i].borderColor,
      backgroundColor: this.colors[i].borderColor,
    }));
  }

  loadStatistics(connectId, interfaceId, type, period) {
    return this.cloudConnectService.loadStatistics(
      connectId,
      interfaceId,
      type,
      period,
    );
  }
}
