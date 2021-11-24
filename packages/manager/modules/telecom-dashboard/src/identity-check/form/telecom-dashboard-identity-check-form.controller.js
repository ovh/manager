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
      .catch((error) => new this.TucToastError(error))
      .finally(() => {
        this.isLoading = false;
      });
  }

  canCreateProcedure() {
    return this.form?.$valid && !this.isCreating;
  }

  createProcedure() {
    if (!this.canCreateProcedure()) return;

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

  cancelProcedure() {
    if (!this.procedure || this.isCancelling) return;

    const { id } = this.procedure;

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
}
