export default class KycIdentityOverviewController {
  /* @ngInject */
  constructor() {
    this.editMode = false;
  }

  $onInit() {
    this.isEditable = this.svaWallet.kycStatus !== 'BLOCKED';
  }

  goToIdentityEditForm() {
    this.editMode = true;
  }
}
