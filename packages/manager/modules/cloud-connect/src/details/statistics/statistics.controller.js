import get from 'lodash/get';
import map from 'lodash/map';

import {
  PERIOD,
  PERIOD_ENUM,
  STATISTICS,
  TYPE,
  TYPE_ENUM,
  TYPE_LABELS,
} from './statistics.constant';

export default class CloudConnectStatisticsCtrl {
  /* @ngInject */
  constructor($q, $translate, CucCloudMessage, cloudConnectService) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.cloudConnectService = cloudConnectService;
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
    this.options = { ...this.STATISTICS.options };
    this.options.scales.yAxes[0].ticks = {
      beginAtZero: true,
    };

    this.lightOptions = { ...this.STATISTICS.options };
    this.lightOptions.scales.yAxes[0].scaleLabel.labelString = this.$translate.instant(
      'cloud_connect_stats_light_unit',
    );

    this.isLoading = false;
    this.loadGraphs();
  }

  loadGraphs() {
    switch (this.graphType) {
      case this.TYPE.LIGHT:
        this.loadLightGraph();
        this.displayedGraph = this.TYPE.LIGHT;
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

  // Load error statistics
  loadErrorGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    // Update options
    this.options.scales.yAxes[0].scaleLabel.labelString = this.$translate.instant(
      'cloud_connect_stats_error_unit',
    );

    this.cloudConnect.interfaceList.forEach((interfaceId) => {
      return this.$q
        .all({
          download: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.ERROR_DOWN,
            this.graphPeriod,
          ),
          upload: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.ERROR_UP,
            this.graphPeriod,
          ),
        })
        .then((stats) => {
          if (stats.download.length > 0 || stats.upload.length > 0) {
            this.updateStats(this.TYPE.ERROR, interfaceId, stats);
            this.isLoading = false;
          }
        });
    });
  }

  // Load light statistics
  loadLightGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    this.cloudConnect.interfaceList.forEach((interfaceId) => {
      return this.$q
        .all({
          in: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.LIGHT_IN,
            this.graphPeriod,
          ),
          out: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.LIGHT_OUT,
            this.graphPeriod,
          ),
        })
        .then((stats) => {
          if (stats.in.length > 0 || stats.out.length > 0) {
            this.updateStats(this.TYPE.LIGHT, interfaceId, stats);
            this.isLoading = false;
          }
        });
    });
  }

  // Load traffic statistics
  loadTrafficGraph() {
    this.series = [];
    this.data = [];
    this.isLoading = true;

    // Update options
    this.options.scales.yAxes[0].scaleLabel.labelString = this.$translate.instant(
      'cloud_connect_stats_traffic_unit',
    );

    this.cloudConnect.interfaceList.forEach((interfaceId) => {
      return this.$q
        .all({
          download: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.TRAFFIC_DOWN,
            this.graphPeriod,
          ),
          upload: this.loadStatistics(
            this.cloudConnect.id,
            interfaceId,
            this.TYPE.TRAFFIC_UP,
            this.graphPeriod,
          ),
        })
        .then((stats) => {
          if (stats.download.length > 0 || stats.upload.length > 0) {
            this.updateStats(this.TYPE.TRAFFIC, interfaceId, stats);
            this.isLoading = false;
          }
        });
    });
  }

  updateStats(type, interfaceId, stats) {
    let serieLabels = null;
    let dataProperties = null;
    switch (type) {
      case this.TYPE.LIGHT:
        serieLabels = [this.TYPE_LABELS.light_in, this.TYPE_LABELS.light_out];
        dataProperties = [this.TYPE_LABELS.in, this.TYPE_LABELS.out];
        break;
      default:
        if (type === this.TYPE.ERROR) {
          serieLabels = [
            this.TYPE_LABELS.error_download,
            this.TYPE_LABELS.error_upload,
          ];
        } else {
          serieLabels = [
            this.TYPE_LABELS.traffic_download,
            this.TYPE_LABELS.traffic_upload,
          ];
        }
        dataProperties = [this.TYPE_LABELS.download, this.TYPE_LABELS.upload];
        break;
    }

    serieLabels.forEach((label) => {
      this.series.push(this.$translate.instant(label, { interfaceId }));
    });

    this.labels = map(get(stats, dataProperties[0]), (value) => value[0]);
    dataProperties.forEach((prop) => {
      this.data.push(map(get(stats, prop), (value) => value[1].value));
    });
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
