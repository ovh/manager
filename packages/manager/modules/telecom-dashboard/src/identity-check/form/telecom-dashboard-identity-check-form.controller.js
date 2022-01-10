import confirmController from './confirm/confirm.controller';
import confirmTemplate from './confirm/confirm.html';

export default class IdentityCheckFormCtrl {
  /* @ngInject */
  constructor(
    $uibModal,
    $translate,
    atInternet,
    coreConfig,
    ovhPaymentMethodHelper,
    IdentityCheckService,
    TucToast,
  ) {
    this.atInternet = atInternet;

    const { isValidIban, isValidBic } = ovhPaymentMethodHelper;
    const { name, firstname, address } = coreConfig.getUser();

    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.user = coreConfig.getUser();

    this.isValidIban = isValidIban;
    this.isValidBic = isValidBic;
    this.IdentityCheckService = IdentityCheckService;
    this.TucToast = TucToast;

    this.isLoading = true;
    this.isCreating = false;
    this.isCancelling = false;
    this.form = null;
    this.procedure = null;
    this.model = {
      bic: '',
      iban: '',
      ownerAddress: address,
      ownerFirstName: firstname,
      ownerLastName: name,
    };
  }

  $onInit() {
    this.IdentityCheckService.getLastInProgressProcedure()
      .then((procedure) => {
        this.procedure = procedure;
      })
      .catch((error) =>
        this.TucToast.error(error.data?.message || error.message),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  canCreateProcedure() {
    return this.form?.$valid && !this.isCreating;
  }

  createProcedure() {
    this.trackClick('confirm');

    const { ownerFirstName, ownerLastName, ...data } = this.model;

    data.ownerName = `${ownerFirstName} ${ownerLastName}`;
    this.isCreating = true;

    this.IdentityCheckService.createProcedure(data)
      .then((procedure) => {
        this.procedure = procedure;
      })
      .catch((error) =>
        this.TucToast.error(error.data?.message || error.message),
      )
      .finally(() => {
        this.isCreating = false;
      });
  }

  canCancelProcedure() {
    return !!this.procedure && !this.isCancelling;
  }

  cancelProcedure() {
    const { id } = this.procedure ?? {};

    this.isCancelling = true;

    this.IdentityCheckService.cancelProcedure(id)
      .then(() => {
        this.trackPage('cancel-account-validation::success');
        this.procedure = null;
        this.TucToast.success(
          this.$translate.instant(
            'telecom_dashboard_identity_check_form_cancel_success',
          ),
        );
      })
      .catch(({ status }) => {
        this.trackPage(
          `cancel-account-validation::error${status === 409 ? '-order' : ''}`,
        );
        this.TucToast.error(
          this.$translate.instant(
            `telecom_dashboard_identity_check_form_cancel_error${
              status === 409 ? '_ongoing' : ''
            }`,
          ),
        );
      })
      .finally(() => {
        this.isCancelling = false;
      });
  }

  confirmCancelProcedure() {
    this.trackPage('account-validation::cancel-validation-popup');
    this.$uibModal
      .open({
        template: confirmTemplate,
        controller: confirmController,
        controllerAs: '$ctrl',
      })
      .result.then(() => {
        this.cancelProcedure();
      })
      .catch(() => {});
  }

  onCancelCreateProcedureForm() {
    this.trackClick('cancel');
    this.goToDashboard();
  }

  openProcedure() {
    this.trackClick('download-pdf');
    const { pdfUrl } = this.procedure ?? {};
    window.open(pdfUrl);
  }

  trackClick(nameClick) {
    this.atInternet.trackClick({
      name: `telecom::telephony::account-validation::${nameClick}`,
      type: 'action',
    });
  }

  trackPage(namePage) {
    this.atInternet.trackPage({
      name: `telecom::telephony::${namePage}`,
    });
  }
}
