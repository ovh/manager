class LogsOptionsManageCtrl {
  constructor(
    $state,
    $stateParams,
    $window,
    CucCloudMessage,
    CucControllerHelper,
    LogsOptionsService,
    LogsOptionsManageService,
    CucCurrencyService,
    CucOrderHelperService,
  ) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsOptionsService = LogsOptionsService;
    this.LogsOptionsManageService = LogsOptionsManageService;
    this.CucCurrencyService = CucCurrencyService;
    this.CucOrderHelperService = CucOrderHelperService;

    this.serviceName = this.$stateParams.serviceName;
    this.initLoaders();
  }

  initLoaders() {
    this.getManagedOptions = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsService.getManagedOptions(this.serviceName),
    });

    this.getAllDashboards = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllDashboards(this.serviceName),
    });

    this.getAllStreams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllStreams(this.serviceName),
    });

    this.getAllIndices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllIndices(this.serviceName),
    });

    this.getAllAliases = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllAliases(this.serviceName),
    });

    this.getAllRoles = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllRoles(this.serviceName),
    });

    this.getAllInputs = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsManageService.getAllInputs(this.serviceName),
    });

    this.getManagedOptions.load();
    this.getAllAliases.load();
    this.getAllDashboards.load();
    this.getAllIndices.load();
    this.getAllStreams.load();
    this.getAllRoles.load();
    this.getAllInputs.load();
  }

  terminateOption(option) {
    this.removeOption = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsOptionsService.terminateOption(this.serviceName, option),
    });
  }

  overview(info) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl:
          'app/dbaas/logs/detail/options/manage/overview/logs-options-overview.html',
        controller: 'LogsOptionsManageOverviewCtrl',
        controllerAs: 'ctrl',
        resolve: {
          option: () => info,
          aliases: () => this.getAllAliases.data,
          dashboards: () => this.getAllDashboards.data,
          indices: () => this.getAllIndices.data,
          streams: () => this.getAllStreams.data,
          roles: () => this.getAllRoles.data,
          inputs: () => this.getAllInputs.data,
        },
      },
    });
  }

  deactivate(option) {
    this.CucCloudMessage.flushChildMessage();
    this.LogsOptionsService.terminateModal(option).then(() => {
      this.delete = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsOptionsService.terminateOption(this.serviceName, option)
            .then(() => this.initLoaders())
            .finally(() => this.CucControllerHelper.scrollPageToTop()),
      });
      this.delete.load();
    });
  }

  reactivate(option) {
    this.LogsOptionsService.showReactivateInfo(option);
  }

  back() {
    this.$state.go('dbaas.logs.detail.options.home', {
      serviceName: this.serviceName,
    });
  }
}

angular
  .module('managerApp')
  .controller('LogsOptionsManageCtrl', LogsOptionsManageCtrl);
