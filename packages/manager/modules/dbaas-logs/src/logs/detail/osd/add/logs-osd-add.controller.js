export default class LogsOsdAddModalCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    $translate,
    CucControllerHelper,
    osdInfo,
    LogsOrderService,
    LogsOsdService,
    LogsConstants,
  ) {
    this.$stateParams = $stateParams;
    this.$q = $q;
    this.CucControllerHelper = CucControllerHelper;
    this.osdInfo = osdInfo;
    this.LogsOrderService = LogsOrderService;
    this.LogsOsdService = LogsOsdService;
    this.LogsConstants = LogsConstants;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.osd = this.LogsOsdService.getNewOsd();
    this.osdPrice = { price: '' };
    this.initLoaders();
  }

  $onInit() {
    this.isEdit = this.constructor.checkIsEdit(this.osdInfo);
    if (this.isEdit) {
      this.populateOsd();
    } else {
      this.initNew();
    }
  }

  initNew() {
    this.clearOsd();
    this.catalog.load().then((catalog) => {
      const selectedCatalog = catalog.plans.find(
        (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
      );
      const selectedFamily = selectedCatalog.addonsFamily.find(
        (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
      );
      const osdCapacities = selectedFamily.addons.find(
        (add) =>
          add.plan.planCode === this.LogsConstants.CONSUMPTION_REFERENCE.KIBANA,
      );
      const osdUnit = osdCapacities.plan.details.pricings.default.find((capa) =>
        capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
      );
      this.osdPrice.price = osdUnit.price.text;
    });
  }

  initLoaders() {
    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsOrderService.getOrderCatalog(),
    });
  }

  showOsdPrice() {
    return this.$translate.instant(
      'logs_kibana_modal_description_help',
      {
        t0: this.osdPrice.price,
      },
      null,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  clearOsd() {
    this.title = 'logs_kibana_modal_add_title';
    this.osd.description = '';
  }

  populateOsd() {
    this.title = 'logs_kibana_modal_edit_title';
    this.osd.description = this.osdInfo.description;
  }

  static checkIsEdit(osdInfo) {
    return osdInfo !== undefined;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  save() {
    if (this.isEdit) {
      return this.editOsd();
    }
    return this.saveOsd();
  }

  saveOsd() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsOsdService.createOsd(this.serviceName, this.osd)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }

  editOsd() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsOsdService.updateOsd(this.serviceName, this.osdInfo, this.osd)
          .then((response) => this.$uibModalInstance.close(response))
          .catch((response) => this.$uibModalInstance.dismiss(response))
          .finally(() => this.CucControllerHelper.scrollPageToTop()),
    });
    return this.saving.load();
  }
}
