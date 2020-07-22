import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    accountMigrationService,
    atInternet,
    UserAccountServicesAgreements,
  ) {
    this.$translate = $translate;
    this.accountMigrationService = accountMigrationService;
    this.atInternet = atInternet;
    this.UserAccountServicesAgreements = UserAccountServicesAgreements;
  }

  $onInit() {
    this.currentAgreementIndex = 0;
    this.currentAgreement = this.agreements[this.currentAgreementIndex];
    this.AgreementUnderProcess = false;
  }

  acceptAndNext() {
    if (this.currentAgreementIndex === this.agreements.length - 1) {
      this.atInternet.trackClick({
        name: 'autorenew::agreements',
        type: 'action',
        chapter1: 'popup-agreement',
        chapter2: 'accept-all',
      });
    }
    this.AgreementUnderProcess = true;
    this.UserAccountServicesAgreements.accept(this.currentAgreement)
      .then(() => {
        if (this.currentAgreementIndex !== this.agreements.length - 1) {
          this.currentAgreementIndex += 1;
          this.currentAgreement = this.agreements[this.currentAgreementIndex];
          this.AgreementUnderProcess = false;
        } else {
          this.accountMigrationService.refreshMigrationDetails().then(() => {
            this.goBack(false, 'success', true);
          });
        }
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('user_agreements_accept_all_error', {
            message: get(error, 'data.message'),
          }),
          'danger',
          true,
        ),
      );
  }
}
