import { GRAFANA_URL, GUIDES_MONITOR_JOB_URL } from './metrics-token.constants';

export default class {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
    this.grafanaUrl = GRAFANA_URL;
    this.docsMonitoringUrl = GUIDES_MONITOR_JOB_URL;
  }

  closeModal() {
    this.goBack();
  }
}
