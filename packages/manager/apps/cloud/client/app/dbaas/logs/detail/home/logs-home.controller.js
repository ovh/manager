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
              this.streamUsageGraphData = this.newChart('stream-axis');
              this.archiveUsageGraphData = this.newChart('archive-axis');
              this.indiceUsageGraphData = this.newChart('indice-axis');
              this.runLoaders().then(() => this.prepareDataUsageGraphData());
            }
            return service;
          },
        ),
    });
    this.service.load();
  }

  /**
   * instanciate a new chart with default settings
   *
   * @memberof LogsHomeCtrl
   */
  newChart(yAxis) {
    return {
      options: {
        tooltips: this.LogsConstants.CHART_SETTINGS.TOOLTIPS,
        hover: this.LogsConstants.CHART_SETTINGS.HOVER,
        scales: {
          xAxes: [
            {
              ticks: {
                maxTicksLimit: this.LogsConstants.CHART_SETTINGS
                  .MAX_TICKS_LIMIT,
              },
            },
          ],
          yAxes: [
            {
              id: yAxis,
            },
          ],
        },
      },
      colors: this.LogsConstants.CHART_SETTINGS.COLORS,
    };
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
   * Prepares the three data usage graph
   *
   * @memberof LogsHomeCtrl
   */
  prepareDataUsageGraphData() {
    this.prepareUsageGraphData(
      this.streamUsageGraphData,
      this.streamData,
      'logs_home_data_stream',
    );
    this.prepareUsageGraphData(
      this.archiveUsageGraphData,
      this.archiveData,
      'logs_home_data_archive',
    );
    this.prepareUsageGraphData(
      this.indiceUsageGraphData,
      this.indiceData,
      'logs_home_data_index',
    );
  }

  /**
   * Prepares the data usage graph in detail
   *
   * @memberof LogsHomeCtrl
   */
  prepareUsageGraphData(chart, srcData, label) {
    const updatedChart = chart;
    updatedChart.labels = srcData.data.timestamps.map((timestamp) =>
      moment(timestamp).format('DD MMM YY'),
    );
    updatedChart.data = srcData.data.usageData;
    updatedChart.series = [this.$translate.instant(label)];
    updatedChart.options.scales.yAxes[0].ticks = {
      suggestedMin: 0,
      suggestedMax: max(chart.data[0]) * 1.3 || 5,
      callback: (value) =>
        value % 1 === 0 ? this.bytesFilter(value, 2, true) : '',
    };
    updatedChart.options.tooltips.callbacks = {
      label: (tooltipItem, data) => {
        if (tooltipItem.datasetIndex > 1) {
          return '';
        }
        let newLabel = data.datasets[tooltipItem.datasetIndex].label || '';
        if (newLabel) {
          newLabel += ': ';
        }
        newLabel += this.bytesFilter(tooltipItem.yLabel, 2, true);
        return newLabel;
      },
    };
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
      this.streamData = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getDataUsage(
            this.serviceName,
            this.LogsConstants.DATA_STORAGE.METRICS.STREAM_SIZE,
          ),
      });
      this.archiveData = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getDataUsage(
            this.serviceName,
            this.LogsConstants.DATA_STORAGE.METRICS.COLD_STORAGE_TOTAL,
          ),
      });
      this.indiceData = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.LogsHomeService.getDataUsage(
            this.serviceName,
            this.LogsConstants.DATA_STORAGE.METRICS.INDEX_SIZE,
          ),
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
    loaderPromises.push(this.serviceInfos.load());
    if (!this.isAccountDisabled) {
      loaderPromises.push(this.tokenIds.load());
      loaderPromises.push(this.defaultCluster.load());
      loaderPromises.push(this.streamData.load());
      loaderPromises.push(this.archiveData.load());
      loaderPromises.push(this.indiceData.load());
    }
    return this.$q.all(loaderPromises);
  }
}

angular.module('managerApp').controller('LogsHomeCtrl', LogsHomeCtrl);
