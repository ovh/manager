import { WORK_IN_PROGRESS_LINK } from './dashboard.constants';

export default class DedicatedClusterDashboard {
  /* @ngInject */
  constructor(coreConfig) {
    this.WORK_IN_PROGRESS_LINK =
      WORK_IN_PROGRESS_LINK[coreConfig.getRegion()] ||
      WORK_IN_PROGRESS_LINK.DEFAULT;
  }

  onBillingInformationError(error) {
    return this.Alerter.error(error, 'cluster_dashboard_alert');
  }
}
