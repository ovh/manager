import {
  VPS_MONITORING_BPS_OPTIONS,
  VPS_MONITORING_COLORS,
  VPS_MONITORING_PERCENT_OPTIONS,
} from './vps-monitoring.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $translate,
    CucCloudMessage,
    VpsActionService,
    VpsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.serviceName = $stateParams.serviceName;
    this.VpsActionService = VpsActionService;
    this.VpsService = VpsService;

    this.loaders = {
      init: false,
    };
    this.data = {};
    this.period = 'LASTDAY';
  }

  $onInit() {
    this.loadOptions();
    this.loadMonitoring();
  }

  loadMonitoring() {
    this.loaders.init = true;
    this.reset();
    this.VpsService.getMonitoring(this.serviceName, this.period)
      .then((data) => {
        this.data = data;
        this.constructor.humanizeData(_.get(data, 'cpu.values[0].points'), this.monitoring.cpu);
        this.constructor.humanizeData(_.get(data, 'ram.values[0].points'), this.monitoring.ram);
        this.constructor.humanizeData(_.get(data, 'netRx.values[0].points'), this.monitoring.net[0]);
        this.constructor.humanizeData(_.get(data, 'netTx.values[0].points'), this.monitoring.net[1]);
        this.constructor.generateLabels(
          data.cpu.values[0].points,
          data.cpu.pointInterval,
          data.cpu.pointStart,
          this.monitoring.labels,
        );
        this.noCpuData = _.find(_.get(this.data, 'messages'), type => _.get(type, 'params.type').indexOf('cpu') !== -1);
        this.noRamData = _.find(_.get(this.data, 'messages'), type => _.get(type, 'params.type').indexOf('mem') !== -1);
        this.noNetData = _.find(_.get(this.data, 'messages'), type => _.get(type, 'params.type').indexOf('net') !== -1);
      })
      .catch(() => { this.error = true; })
      .finally(() => { this.loaders.init = false; });
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
    _.forEach(data, (element) => {
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
    _.forEach(data, () => {
      tab.push(date.format('MM/DD/YY - HH:mm:ss'));
      date = moment(date).add(unitInterval, pointInterval);
    });
  }

  loadOptions() {
    this.colors = VPS_MONITORING_COLORS;
    this.series = [this.$translate.instant('vps_monitoring_network_netRx'), this.$translate.instant('vps_monitoring_network_netTx')];
    this.percentOption = VPS_MONITORING_PERCENT_OPTIONS;
    this.bpsOption = VPS_MONITORING_BPS_OPTIONS;
  }
}
