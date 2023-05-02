import moment from 'moment';
import { GRAFANA_URL, GUIDES_MONITOR_JOB_URL } from './metrics-token.constants';
import { DATA_PROCESSING_TRACKING_PREFIX_FULL } from '../../../../data-processing.constants';

export default class {
  /* @ngInject */
  constructor($state, $window, atInternet) {
    this.$state = $state;
    this.docsMonitoringUrl = GUIDES_MONITOR_JOB_URL;
    this.$window = $window;
    this.atInternet = atInternet;
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
    this.atInternet.trackClick({
      name: `${DATA_PROCESSING_TRACKING_PREFIX_FULL}::jobs::job-details::dashboard::metrics-token::access-grafana`,
      type: 'action',
    });
    this.$window.open(this.grafanaUrl, '_blank', 'noopener');
  }

  closeModal() {
    this.goBack();
  }
}
