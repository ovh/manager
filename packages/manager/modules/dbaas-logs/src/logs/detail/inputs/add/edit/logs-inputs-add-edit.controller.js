export default class LogsInputsAddEditCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    CucControllerHelper,
    LogsConstants,
    LogsInputsService,
    LogsOrderService,
    LogsStreamsService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.serviceName = this.$stateParams.serviceName;
    this.inputId = this.$stateParams.inputId;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsConstants = LogsConstants;
    this.LogsInputsService = LogsInputsService;
    this.LogsOrderService = LogsOrderService;
    this.LogsStreamsService = LogsStreamsService;
    this.editMode = Boolean(this.inputId);
    this.availableEngines = [];
    this.inputInstancePrice = { price: '' };
    this.initLoaders();
  }

  $onInit() {
    if (this.editMode) {
      this.input.load();
    } else {
      this.input = this.LogsInputsService.getNewInput();
    }
    this.engines.load().then(({ data }) => {
      this.availableEngines = data.reduce((enginesList, engine) => {
        if (!engine.isDeprecated) {
          enginesList.push(engine);
        }
        return enginesList;
      }, []);
    });
    this.catalog.load().then((catalog) => {
      const selectedCatalog = catalog.plans.find(
        (plan) => plan.planCode === this.LogsConstants.LDP_PLAN_CODE,
      );
      const selectedFamily = selectedCatalog.addonsFamily.find(
        (addon) => addon.family === this.LogsConstants.ADD_ON_FAMILY.NEW,
      );
      const inputInstanceCapacities = selectedFamily.addons.find(
        (add) =>
          add.plan.planCode ===
          this.LogsConstants.CONSUMPTION_REFERENCE.NB_INSTANCE,
      );
      const inputInstance = inputInstanceCapacities.plan.details.pricings.default.find(
        (capa) =>
          capa.capacities.includes(this.LogsConstants.CONSUMPTION_CAPACITY),
      );
      this.inputInstancePrice.price = inputInstance.price.text;
    });
    this.streams.load();
  }

  /**
   * initializes the input log url
   *
   * @memberof LogsInputsAddEditCtrl
   */
  initLoaders() {
    if (this.editMode) {
      this.input = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsInputsService.getInputDetail(
            this.serviceName,
            this.inputId,
            true,
          ),
      });
    }
    this.engines = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsInputsService.getInputEngines(this.serviceName),
    });
    this.streams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsStreamsService.getOwnStreams(this.serviceName),
    });
    this.catalog = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsOrderService.getOrderCatalog(),
    });
  }

  showInputPrices() {
    return this.$translate.instant(
      'inputs_logs_edit_nb_instance_help',
      {
        t0: this.inputInstancePrice.price,
      },
      undefined,
      false,
      'sceParameters', // Expose devise symbol from API without sanitization
    );
  }

  addEditInput() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.inputAddEdit = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.editMode
          ? this.LogsInputsService.updateInput(
              this.serviceName,
              this.input.data,
            )
          : this.LogsInputsService.addInput(this.serviceName, this.input.data),
    });
    return this.inputAddEdit
      .load()
      .then((successData) => {
        if (successData[0].item) {
          return this.gotToNextStep(
            this.inputId || successData[0].item.inputId,
          );
        }
        return this.$q.reject();
      })
      .finally(() => this.CucControllerHelper.scrollPageToTop());
  }

  gotToNextStep(inputId) {
    this.$state.go('dbaas-logs.detail.inputs.input.editwizard.configure', {
      serviceName: this.serviceName,
      inputId,
      exposedPort: this.input.data.exposedPort,
    });
    return this.$q.resolve();
  }
}
