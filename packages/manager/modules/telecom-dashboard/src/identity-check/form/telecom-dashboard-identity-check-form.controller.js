export default class IdentityCheckFormCtrl {
  /* @ngInject */
  constructor(
    coreConfig,
    coreURLBuilder,
    ovhPaymentMethodHelper,
    IdentityCheckService,
    TucToastError,
  ) {
    const { isValidIban, isValidBic } = ovhPaymentMethodHelper;
    const { name, firstname, address } = coreConfig.getUser();

    this.isValidIban = isValidIban;
    this.isValidBic = isValidBic;
    this.IdentityCheckService = IdentityCheckService;
    this.TucToastError = TucToastError;

    this.isLoading = true;
    this.isCreating = false;
    this.isCancelling = false;
    this.form = null;
    this.procedure = null;
    this.telecomLink = coreURLBuilder.buildURL('telecom', '#/');
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
      .catch((error) => new this.TucToastError(error))
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
      .catch((error) => new this.TucToastError(error))
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
      })
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.isCancelling = false;
      });
  }

  openProcedure() {
    const { pdfUrl } = this.procedure ?? {};
    window.open(pdfUrl);
  }
}
