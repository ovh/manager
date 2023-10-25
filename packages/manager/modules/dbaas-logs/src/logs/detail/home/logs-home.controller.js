import max from 'lodash/max';
import { OFFER_TYPES } from '../detail.constants';

import formatSportsTemplate from './formatsports/logs-home-formatsports.html';
import passwordTemplate from '../account/password/logs-account-password.html';

export default class LogsHomeCtrl {
  /* @ngInject */
  constructor(
    $filter,
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    CucControllerHelper,
    LogsAliasesService,
    LogsConstants,
    LogsHomeService,
    LogsIndexService,
    LogsTokensService,
    LogsHelperService,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.$translate = $translate;
    this.bytes = $filter('bytes');
    this.CucControllerHelper = CucControllerHelper;
    this.LogsAliasesService = LogsAliasesService;
    this.LogsHomeService = LogsHomeService;
    this.LogsIndexService = LogsIndexService;
    this.LogsTokensService = LogsTokensService;
    this.LogsHelperService = LogsHelperService;
    this.LogsConstants = LogsConstants;
    this.canAccessToElasticsearch = false;
  }

  $onInit() {
    this.lastUpdatedDate = moment(this.service.updatedAt).format('LL');
    if (this.service.state === this.LogsConstants.SERVICE_STATE_TO_CONFIG) {
      this.goToAccountSetupPage();
    } else {
      this.streamUsageGraphData = this.newChart('stream-axis');
      this.archiveUsageGraphData = this.newChart('archive-axis');
      this.indiceUsageGraphData = this.newChart('indice-axis');
      this.prepareDataUsageGraphData();
      this.canAccessToElasticsearch =
        this.indexIds.length + this.aliasIds.length > 0;
    }
  }

  getPlanName() {
    return OFFER_TYPES[this.accountDetails.plan];
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
    return this.gotoState('dbaas-logs.detail.setup');
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
          template: passwordTemplate,
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
      this.LogsConstants.DATA_STORAGE.METRICS.STREAM_SIZE,
      this.streamUsageGraphData,
      'logs_home_data_stream',
    );
    this.prepareUsageGraphData(
      this.LogsConstants.DATA_STORAGE.METRICS.COLD_STORAGE_TOTAL,
      this.archiveUsageGraphData,
      'logs_home_data_archive',
    );
    this.prepareUsageGraphData(
      this.LogsConstants.DATA_STORAGE.METRICS.INDEX_SIZE,
      this.indiceUsageGraphData,
      'logs_home_data_index',
    );
  }

  /**
   * Prepares the data usage graph in detail
   *
   * @memberof LogsHomeCtrl
   */
  prepareUsageGraphData(metric, chart, label) {
    const updatedChart = chart;
    updatedChart.labels = this.dataUsage[metric].timestamps.map((timestamp) =>
      moment(timestamp).format('DD MMM YY'),
    );
    updatedChart.data = this.dataUsage[metric].usageData;
    updatedChart.series = [this.$translate.instant(label)];
    updatedChart.options.scales.yAxes[0].ticks = {
      suggestedMin: 0,
      suggestedMax: max(chart.data[0]) * 1.3 || 5,
      callback: (value) => (value % 1 === 0 ? this.bytes(value, 2, true) : ''),
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
        newLabel += this.bytes(tooltipItem.yLabel, 2, true);
        return newLabel;
      },
    };
  }

  changeName() {
    return this.gotoState('dbaas-logs.detail.home.account');
  }

  goToAllStreams() {
    return this.gotoState('dbaas-logs.detail.streams');
  }

  goToAllDashboards() {
    return this.gotoState('dbaas-logs.detail.dashboards');
  }

  /**
   * Redirects to the tokens page
   *
   * @memberof LogsHomeCtrl
   */
  editTokens() {
    return this.gotoState('dbaas-logs.detail.tokens');
  }

  /**
   * Redirects to the encryption keys page
   *
   * @memberof LogsHomeCtrl
   */
  editEncryptionKeys() {
    return this.gotoState('dbaas-logs.detail.encryption-keys.home');
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

  /**
   * Opens the Messages and Ports information dialog
   *
   * @memberof LogsHomeCtrl
   */
  openMessagesAndPorts() {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: formatSportsTemplate,
        controller: 'LogsHomeFormatsportsCtrl',
        controllerAs: 'ctrl',
        resolve: {
          accountDetails: () => this.accountDetails,
        },
      },
    });
  }
}
