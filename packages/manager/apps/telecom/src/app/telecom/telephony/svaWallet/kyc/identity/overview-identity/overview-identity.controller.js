import { WEBSITE_URL_DEFAULT } from '../identity.constants';

export default class KycIdentityOverviewController {
  /* @ngInject */
  constructor() {
    this.editMode = false;
  }

  $onInit() {
    this.isEditable = this.svaWallet.kycStatus !== 'BLOCKED';
    this.WEBSITE_URL_DEFAULT = WEBSITE_URL_DEFAULT;
  }

  goToIdentityEditForm() {
    this.editMode = true;
  }

  isVisibleWebsiteUrl() {
    return (
      this.svaWallet.company.marketplace &&
      this.svaWallet.company.websiteUrl !== this.WEBSITE_URL_DEFAULT
    );
  }
}
