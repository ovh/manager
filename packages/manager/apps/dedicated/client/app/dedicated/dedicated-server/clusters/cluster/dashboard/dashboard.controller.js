import { TRAVAUX_LINK } from './dashboard.constants';

export default class DedicatedClusterDashboard {
  /* @ngInject */
  constructor(coreConfig) {
    this.TRAVAUX_LINK =
      TRAVAUX_LINK[coreConfig.getRegion()] || TRAVAUX_LINK.DEFAULT;
  }

  onBillingInformationError(error) {
    return this.Alerter.error(error, 'cluster_dashboard_alert');
  }
}
