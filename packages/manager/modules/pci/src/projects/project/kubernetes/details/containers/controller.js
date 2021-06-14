import { DASHBOARD_URL } from './constants';

export default class KubernetesContainersCtrl {
  /* @ngInject */
  constructor(coreConfig) {
    this.user = coreConfig.getUser();
    this.dashboardUrl =
      DASHBOARD_URL[this.user.ovhSubsidiary] || DASHBOARD_URL.DEFAULT;
  }
}
