import find from 'lodash/find';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import 'moment';

import {
  VPS_MONITORING_BPS_OPTIONS,
  VPS_MONITORING_PERCENT_OPTIONS,
} from './vps-monitoring.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    ChartFactory,
    CucCloudMessage,
    VpsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.ChartFactory = ChartFactory;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = $stateParams.serviceName;
    this.VpsService = VpsService;

    this.loaders = {
      init: false,
    };
    this.data = {};
    this.period = 'LASTDAY';
    this.cpuChart = new this.ChartFactory(
      angular.copy(VPS_MONITORING_PERCENT_OPTIONS),
    );
    this.ramChart = new this.ChartFactory(
      angular.copy(VPS_MONITORING_PERCENT_OPTIONS),
    );
    this.netChart = new this.ChartFactory(
      angular.copy(VPS_MONITORING_BPS_OPTIONS),
    );
  }

  $onInit() {
    this.loadMonitoring();
  }

  loadMonitoring() {
    this.loaders.init = true;
    this.reset();
    this.VpsService.getMonitoring(this.serviceName, this.period)
      .then((data) => {
        this.data = data;
        this.constructor.generateLabels(
          data.cpu.values[0].points,
          data.cpu.pointInterval,
          data.cpu.pointStart,
          this.monitoring.labels,
        );
        this.cpuChart.data.labels = this.monitoring.labels;
        this.ramChart.data.labels = this.monitoring.labels;
        this.netChart.data.labels = this.monitoring.labels;

        // CPU
        this.constructor.humanizeData(
          get(data, 'cpu.values[0].points'),
          this.monitoring.cpu,
        );
        this.cpuChart.data.datasets = [{ data: this.monitoring.cpu }];

        // RAM
        this.constructor.humanizeData(
          get(data, 'ram.values[0].points'),
          this.monitoring.ram,
        );
        this.ramChart.data.datasets = [{ data: this.monitoring.ram }];

        // NET
        this.constructor.humanizeData(
          get(data, 'netRx.values[0].points'),
          this.monitoring.net[0],
        );
        this.constructor.humanizeData(
          get(data, 'netTx.values[0].points'),
          this.monitoring.net[1],
        );

        this.netChart.data.datasets = [
          {
            label: this.$translate.instant('vps_monitoring_network_netRx'),
            data: this.monitoring.net[0],
            borderColor: 'rgba(241, 196, 15, 1)',
            backgroundColor: 'rgba(241, 196, 15, .2)',
          },
          {
            label: this.$translate.instant('vps_monitoring_network_netTx'),
            data: this.monitoring.net[1],
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, .2)',
          },
        ];

        this.noCpuData = find(
          get(this.data, 'messages'),
          (type) => get(type, 'params.type').indexOf('cpu') !== -1,
        );
        this.noRamData = find(
          get(this.data, 'messages'),
          (type) => get(type, 'params.type').indexOf('mem') !== -1,
        );
        this.noNetData = find(
          get(this.data, 'messages'),
          (type) => get(type, 'params.type').indexOf('net') !== -1,
        );
      })
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.loaders.init = false;
      });
  }

  reset() {
    this.monitoring = {
      cpu: [],
      ram: [],
      net: [[], []],
      labels: [],
    };
  }

  static humanizeData(data, tab) {
    forEach(data, (element) => {
      if (element && element.y) {
        tab.push(element.y);
      } else {
        tab.push(0);
      }
    });
  }

  static generateLabels(data, interval, start, tab) {
    const unitInterval = 'minutes';
    const pointInterval = interval.standardMinutes;
    let date = moment(start);
    forEach(data, () => {
      tab.push(date.format('MM/DD/YY - HH:mm:ss'));
      date = moment(date).add(unitInterval, pointInterval);
    });
  }
}
