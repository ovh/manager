import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    accountMigrationService,
    atInternet,
    UserAccountServicesAgreements,
  ) {
    this.$translate = $translate;
    this.accountMigrationService = accountMigrationService;
    this.atInternet = atInternet;
    this.UserAccountServicesAgreements = UserAccountServicesAgreements;
    this.agreements = null;
    this.currentAgreement = null;
    this.loading = true;
    this.error = false;
    this.primaryLabel = '';
    this.secondaryLabel = '';
    this.$q = $q;
  }

  $onInit() {
    this.currentAgreementIndex = 0;
    this.agreementId = parseInt(this.agreementId, 10);
    this.getAgreements();
    this.AgreementUnderProcess = false;
  }

  getAgreements() {
    this.loading = true;
    if (this.agreementId) {
      this.$q
        .all([
          this.UserAccountServicesAgreements.getAgreement(this.agreementId),
          this.UserAccountServicesAgreements.getContract(this.agreementId),
        ])
        .then(([agreement, contract]) => {
          if (agreement && contract) {
            this.agreements = [{ ...agreement, ...contract }];
            this.secondaryLabel = 'wizard_cancel';
            this.primaryLabel = 'user_agreements_accept';
            this.currentAgreement = this.agreements[this.currentAgreementIndex];
          } else {
            this.primaryLabel = 'user_agreements_accept_all_ok';
          }
        })
        .catch(() => {
          this.error = true;
          this.primaryLabel = 'user_agreements_accept_all_ok';
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.UserAccountServicesAgreements.getToValidate()
        .then((result) => {
          this.agreements = result.list.results;
          if (this.agreements?.length) {
            this.currentAgreement = this.agreements[this.currentAgreementIndex];
            this.secondaryLabel = 'wizard_cancel';
            this.primaryLabel =
              this.currentAgreementIndex === this.agreements.length - 1
                ? 'user_agreements_accept'
                : 'user_agreements_accept_all_accept_and_next';
          } else {
            this.primaryLabel = 'user_agreements_accept_all_ok';
          }
        })
        .catch(() => {
          this.error = true;
          this.primaryLabel = 'user_agreements_accept_all_ok';
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  primaryAction() {
    if ((!this.loading && !this.agreements?.length) || this.error) {
      this.goBack(false, 'success', true);
    } else {
      this.acceptAndNext();
    }
  }

  acceptAndNext() {
    if (this.currentAgreementIndex === this.agreements.length - 1) {
      this.atInternet.trackClick({
        name:
          'dedicated::account::billing::autorenew::agreements::popup-agreement::accept-all',
        type: 'action',
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
