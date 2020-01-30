import max from 'lodash/max';

class LogsHomeCtrl {
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    bytesFilter,
    CucControllerHelper,
    LogsConstants,
    LogsHomeService,
    LogsTokensService,
    LogsHelperService,
    LogsDetailService,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.bytesFilter = bytesFilter;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsHomeService = LogsHomeService;
    this.LogsTokensService = LogsTokensService;
    this.LogsHelperService = LogsHelperService;
    this.LogsDetailService = LogsDetailService;
    this.LogsConstants = LogsConstants;
  }

  $onInit() {
    this.service = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDetailService.getServiceDetails(this.serviceName).then(
          (service) => {
            this.initLoaders();
            this.isAccountDisabled = this.LogsHelperService.isAccountDisabled(
              service,
            );
            this.lastUpdatedDate = moment(service.updatedAt).format('LL');
            if (service.state === this.LogsConstants.SERVICE_STATE_TO_CONFIG) {
              this.goToAccountSetupPage();
            } else {
              this.dataUsageGraphData = this.LogsConstants.DATA_USAGE_GRAPH_CONFIGURATION;
              this.runLoaders().then(() => this.prepareDataUsageGraphData());
            }
            return service;
          },
        ),
    });
    this.service.load();
  }

  goToAccountSetupPage() {
    return this.gotoState('dbaas.logs.detail.setup');
  }

  /**
   * opens UI modal to change password
   *
   * @memberof LogsHomeCtrl
   */
  openChangePasswordModal() {
    this.CucControllerHelper.modal
      .showModal({
        modalConfig: {
          templateUrl:
            'app/dbaas/logs/detail/account/password/logs-account-password.html',
          controller: 'LogsAccountPasswordCtrl',
          controllerAs: 'ctrl',
          backdrop: 'static',
        },
      })
      .finally(() => this.CucControllerHelper.scrollPageToTop());
  }

  /**
   * Prepares the data usage graph
   *
   * @memberof LogsHomeCtrl
   */
  prepareDataUsageGraphData() {
    const offerLimit =
      this.account.data.offer.esStorage *
      this.LogsConstants.OFFER_STORAGE_MULTIPLIER;
    const maxDataReceived = max(this.storageData.data.usageData[0]);
    this.dataUsageGraphData.labels = this.storageData.data.timestamps.map(
      (timestamp) => moment(timestamp).format('DD MMM'),
    );
    this.dataUsageGraphData.data = this.storageData.data.usageData;
    this.dataUsageGraphData.series = [
      this.$translate.instant('logs_home_data_received'),
      this.$translate.instant('logs_home_number_of_documents'),
    ];
    if (offerLimit <= maxDataReceived * 1.5) {
      this.dataUsageGraphData.data.push(
        this.storageData.data.timestamps.map(() => offerLimit),
      );
      this.dataUsageGraphData.series.push(
        this.$translate.instant('logs_home_offer_limit'),
      );
    }
    this.dataUsageGraphData.options.scales.yAxes[0].ticks = {
      suggestedMin: 0,
      suggestedMax: maxDataReceived * 1.3 || 5,
      callback: (value) =>
        value % 1 === 0 ? this.bytesFilter(value, 2, true) : '',
    };
    this.dataUsageGraphData.options.scales.yAxes[1].ticks = {
      suggestedMin: 0,
      suggestedMax: max(this.dataUsageGraphData.data[1]) * 1.3 || 5,
      callback: (value) => (value % 1 === 0 ? value : ''),
    };

    this.dataUsageGraphData.options.tooltips.callbacks = {
      label: (tooltipItem, data) => {
        if (tooltipItem.datasetIndex > 1) {
          return '';
        }
        let label = data.datasets[tooltipItem.datasetIndex].label || '';
        if (label) {
          label += ': ';
        }
        label +=
          tooltipItem.datasetIndex === 0
            ? this.bytesFilter(tooltipItem.yLabel, 2, true)
            : this.LogsHomeService.constructor.humanizeNumber(
                tooltipItem.yLabel,
              );
        return label;
      },
    };
  }

  editCappedPlan() {
    return this.gotoState('dbaas.logs.detail.home.capped');
  }

  changeName() {
    return this.gotoState('dbaas.logs.detail.home.account');
  }

  goToAllStreams() {
    return this.gotoState('dbaas.logs.detail.streams');
  }

  goToAllDashboards() {
    return this.gotoState('dbaas.logs.detail.dashboards');
  }

  goToChangeOffer() {
    return this.gotoState('dbaas.logs.detail.offer');
  }

  /**
   * takes to options UI page if account is pro else shows offer upgrade required modal
   */
  goToOptionsPage() {
    if (this.LogsHelperService.isBasicOffer(this.account.data)) {
      return this.LogsHelperService.showOfferUpgradeModal(this.serviceName);
    }
    return this.gotoState('dbaas.logs.detail.options');
  }

  /**
   * Redirects to the tokens page
   *
   * @memberof LogsHomeCtrl
   */
  editTokens() {
    return this.gotoState('dbaas.logs.detail.tokens');
  }

  /**
   * Opens the edit password dialog
   *
   * @memberof LogsHomeCtrl
   */
  editPassword() {
    this.openChangePasswordModal();
  }

  gotoState(state) {
    return this.$state.go(state, {
      serviceName: this.serviceName,
    });
  }

  /**
   * initializes the loaders
   *
   * @memberof LogsHomeCtrl
   */
  initLoaders() {
    this.accountDetails = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getAccountDetails(this.serviceName),
    });
    this.account = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.LogsHomeService.getAccount(this.serviceName),
    });
    this.options = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () => this.LogsHomeService.getOptions(this.serviceName),
    });
    this.serviceInfos = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsHomeService.getServiceInfos(this.serviceName),
    });
    if (!this.isAccountDisabled) {
      this.tokenIds = this.CucControllerHelper.request.getArrayLoader({
        loaderFunction: () =>
          this.LogsTokensService.getTokensIds(this.serviceName),
      });
      this.defaultCluster = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsTokensService.getDefaultCluster(this.serviceName),
      });
      this.storageData = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getDataUsage(this.serviceName),
      });
      this.coldStorage = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getColdstorage(this.serviceName),
      });
    }
  }

  /**
   * Opens the Messages and Ports information dialog
   *
   * @memberof LogsHomeCtrl
   */
  openMessagesAndPorts() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl:
          'app/dbaas/logs/detail/home/formatsports/logs-home-formatsports.html',
        controller: 'LogsHomeFormatsportsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          accountDetails: () => this.accountDetails.data,
        },
      },
    });
  }

  /**
   * Runs the loaders
   *
   * @memberof LogsHomeCtrl
   */
  runLoaders() {
    const loaderPromises = [];
    loaderPromises.push(this.accountDetails.load());
    loaderPromises.push(this.account.load());
    loaderPromises.push(this.options.load());
    loaderPromises.push(this.serviceInfos.load());
    if (!this.isAccountDisabled) {
      loaderPromises.push(this.tokenIds.load());
      loaderPromises.push(this.defaultCluster.load());
      loaderPromises.push(this.storageData.load());
      loaderPromises.push(this.coldStorage.load());
    }
    return this.$q.all(loaderPromises);
  }
}

angular.module('managerApp').controller('LogsHomeCtrl', LogsHomeCtrl);
