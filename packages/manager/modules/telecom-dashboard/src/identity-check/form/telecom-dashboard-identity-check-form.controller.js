export default class IdentityCheckFormCtrl {
  /* @ngInject */
  constructor(
    $state,
    atInternet,
    coreConfig,
    coreURLBuilder,
    ovhPaymentMethodHelper,
    IdentityCheckService,
    TucToastError,
  ) {
    this.$state = $state;
    this.atInternet = atInternet;

    const { isValidIban, isValidBic } = ovhPaymentMethodHelper;

    this.user = coreConfig.getUser();
    this.isValidIban = isValidIban;
    this.isValidBic = isValidBic;
    this.IdentityCheckService = IdentityCheckService;
    this.TucToastError = TucToastError;

    this.isLoading = true;
    this.isCreating = false;
    this.isCancelling = false;
    this.form = null;
    this.procedure = null;
    this.model = {
      bic: '',
      iban: '',
      ownerAddress: '',
      ownerFirstName: '',
      ownerLastName: '',
    };
  }

  $onInit() {
    this.atInternet.trackPage({
      name: 'telecom::telephony::account-validation',
    });

    const { name, firstname, address } = this.user;

    this.model.ownerAddress = address;
    this.model.ownerFirstName = firstname;
    this.model.ownerLastName = name;

    this.IdentityCheckService.getLastInProgressProcedure()
      .then((procedure) => {
        this.procedure = procedure;
      })
      .catch((error) => new this.TucToastError(error))
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
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.isCreating = false;
      });
  }

  canCancelProcedure() {
    return !!this.procedure && !this.isCancelling;
  }

  cancelProcedure() {
    this.trackClick('cancel-current-validation');

    const { id } = this.procedure ?? {};

    this.isCancelling = true;

    this.IdentityCheckService.cancelProcedure(id)
      .then(() => {
        this.procedure = null;
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.isCancelling = false;
      });
  }

  onCancelCreateProcedureForm() {
    this.trackClick('cancel');
    this.$state.go('telecom-dashboard');
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
}
