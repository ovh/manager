import moment from 'moment';
import { GRAFANA_URL, GUIDES_MONITOR_JOB_URL } from './metrics-token.constants';

export default class {
  /* @ngInject */
  constructor($state, $window) {
    this.$state = $state;
    this.docsMonitoringUrl = GUIDES_MONITOR_JOB_URL;
    this.$window = $window;
  }

  $onInit() {
    // add job parameters to grafana url
    this.grafanaUrl = this.job
      ? `${GRAFANA_URL}&var-jobId=${this.jobId}`
      : GRAFANA_URL;
    if (this.job.creationDate) {
      this.grafanaUrl = `${this.grafanaUrl}&from=${moment(
        this.job.creationDate,
      ).valueOf()}`;
    }
    if (this.job.endDate) {
      this.grafanaUrl = `${this.grafanaUrl}&to=${moment(
        this.job.endDate,
      ).valueOf()}`;
    }
  }

  goToGrafana() {
    this.$window.open(this.grafanaUrl, '_blank', 'noopener');
  }

  closeModal() {
    this.goBack();
  }
}
