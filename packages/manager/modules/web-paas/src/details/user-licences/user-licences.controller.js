import { ADDON_TYPE } from '../../web-paas.constants';

export default class {
  $onInit() {
    this.ADDON_TYPE = ADDON_TYPE;
    this.alerts = {
      licences: 'web_paas_licences_alert',
    };
  }

  canAddUserLicences() {
    return (
      this.project.getTotalLicences() <
      this.project.selectedPlan.getMaxLicenses()
    );
  }

  isAdmin() {
    return this.project.getAccountName() === this.user.nichandle;
  }

  static getChangeOfferState(projectId) {
    return `web-paas.dashboard.service.change-offer({ projectId: '${projectId}'})`;
  }
}
