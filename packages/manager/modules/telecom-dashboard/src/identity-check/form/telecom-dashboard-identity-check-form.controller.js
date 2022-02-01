export default class IdentityCheckFormCtrl {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    ovhPaymentMethodHelper,
    IdentityCheckService,
    TucToast,
  ) {
    const { isValidIban, isValidBic } = ovhPaymentMethodHelper;
    const { name, firstname, address, zip, city } = coreConfig.getUser();

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
      ownerZip: zip,
      ownerCity: city,
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

    const {
      ownerFirstName,
      ownerLastName,
      ownerAddress,
      ownerZip,
      ownerCity,
      ...data
    } = this.model;

    data.ownerName = `${ownerFirstName} ${ownerLastName}`;
    data.ownerAddress = `${ownerAddress} ${ownerZip} ${ownerCity}`;
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

  modalCancelProcedure() {
    this.trackClick('cancel-current-validation');
    const { id } = this.procedure ?? {};
    return this.goToModalCancelProcedure(id);
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
}
