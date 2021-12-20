import confirmController from './confirm/confirm.controller';
import confirmTemplate from './confirm/confirm.html';

export default class IdentityCheckFormCtrl {
  /* @ngInject */
  constructor(
    $uibModal,
    $translate,
    coreConfig,
    coreURLBuilder,
    ovhPaymentMethodHelper,
    IdentityCheckService,
    TucToast,
  ) {
    const { isValidIban, isValidBic } = ovhPaymentMethodHelper;

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
    this.telecomLink = coreURLBuilder.buildURL('telecom', '#/');
    this.model = {
      bic: '',
      iban: '',
      ownerAddress: '',
      ownerFirstName: '',
      ownerLastName: '',
    };
  }

  $onInit() {
    const { name, firstname, address } = this.user;

    this.model.ownerAddress = address;
    this.model.ownerFirstName = firstname;
    this.model.ownerLastName = name;

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
        this.procedure = null;
        this.TucToast.success(
          this.$translate.instant(
            'telecom_dashboard_identity_check_form_cancel_success',
          ),
        );
      })
      .catch(({ status }) => {
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

  openProcedure() {
    const { pdfUrl } = this.procedure ?? {};
    window.open(pdfUrl);
  }
}
