import { ADDON_TYPE } from '../../web-paas.constants';
import { CHANGE_OFFER_IMPRESSION_TRACKING_DATA } from './user-licences.constants';

export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  $onInit() {
    this.ADDON_TYPE = ADDON_TYPE;
    this.alerts = {
      licences: 'web_paas_licences_alert',
    };
    this.trackImpression();
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

  trackImpression() {
    this.trackingData = {
      ...CHANGE_OFFER_IMPRESSION_TRACKING_DATA,
      variant: `[${this.project.offerName}]`,
      format: `[${this.project.isStartOffer() ? 'develop-expand' : 'expand'}]`,
    };
    if (
      (this.project.isDevelopOffer() && !this.canAddUserLicences()) ||
      this.project.isStartOffer()
    ) {
      this.atInternet.trackImpression(this.trackingData);
    }
  }

  trackClickImpression() {
    return this.atInternet.trackClickImpression({
      click: this.trackingData,
    });
  }
}
