export default class LogsKibanaAddModalCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    $translate,
    CucControllerHelper,
    kibanaInfo,
    LogsKibanaService,
    LogsConstants,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.kibanaInfo = kibanaInfo;
    this.LogsKibanaService = LogsKibanaService;
    this.LogsConstants = LogsConstants;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.kibana = this.LogsKibanaService.getNewKibana();
    this.kibanaPrice = { price: '' };
    this.initLoaders();
  }

  $onInit() {
    this.isEdit = this.constructor.checkIsEdit(this.kibanaInfo);
    if (this.isEdit) {
      this.populateKibana();
    } else {
      this.initNew();
    }
  }

  initNew() {
    this.clearKibana();
    this.accountDetails
      .load()
      .then(() => {
        this.ovhSubsidiary = this.accountDetails.data.me.ovhSubsidiary;
        return this.catalog.load();
      })
      .then(() => {
        const selectedCatalog = this.catalog.data.plans.find(
          (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
        );
        const selectedFamily = selectedCatalog.addonsFamily.find(
          (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
        );
        const kibanaCapacities = selectedFamily.addons.find(
          (add) =>
            add.plan.planCode ===
            this.LogsConstants.CONSUMPTION_REFERENCE.KIBANA,
        );
        const kibanaUnit = kibanaCapacities.plan.details.pricings.default.find(
          (capa) =>
            capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
        );
        this.kibanaPrice.price = kibanaUnit.price.text;
      });
  }

  initLoaders() {
    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsKibanaService.getOrderCatalog(this.ovhSubsidiary),
    });
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsKibanaService.getAccountDetails(this.serviceName),
    });
  }

  showKibanaPrice() {
    return this.$translate.instant(
      'logs_kibana_modal_description_help',
      {
        t0: this.kibanaPrice.price,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  clearKibana() {
    this.title = 'logs_kibana_modal_add_title';
    this.kibana.description = '';
  }

  populateKibana() {
    this.title = 'logs_kibana_modal_edit_title';
    this.kibana.description = this.kibanaInfo.description;
  }

  static checkIsEdit(kibanaInfo) {
    return kibanaInfo !== undefined;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  save() {
    if (this.isEdit) {
      return this.editKibana();
    }
    return this.saveKibana();
  }

  saveKibana() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsKibanaService.createKibana(this.serviceName, this.kibana)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  editKibana() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsKibanaService.updateKibana(
          this.serviceName,
          this.kibanaInfo,
          this.kibana,
        )
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}
