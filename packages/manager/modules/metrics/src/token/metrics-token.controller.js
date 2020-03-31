import MetricsTokenDeleteCtrl from './delete/metrics-token-delete.controller';
import MetricsTokenEditCtrl from './edit/metrics-token-edit.controller';
import MetricsTokenPreviewCtrl from './preview/metrics-token-preview.controller';

import tokenDeleteTemplate from './delete/metrics-token-delete.html';
import tokenEditTemplate from './edit/metrics-token-edit.html';
import tokenPreviewTemplate from './preview/metrics-token-preview.html';

export default class MetricsTokenCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    CucControllerHelper,
    MetricService,
    ovhDocUrl,
  ) {
    this.scope = $scope;
    this.$stateParams = $stateParams;
    this.serviceName = $stateParams.serviceName;
    this.$translate = $translate;
    this.CucControllerHelper = CucControllerHelper;
    this.MetricService = MetricService;
    this.ovhDocUrl = ovhDocUrl;

    this.tokens = [];
    this.loading = false;
  }

  $onInit() {
    this.getTokens(this.serviceName);
  }

  getTokens(serviceName) {
    this.loading = true;
    this.MetricService.getTokens(serviceName).then((data) => {
      this.tokens = data.filter((token) => token.isRevoked === false);
      this.loading = false;
    });
  }

  getGuides() {
    return this.ovhDocUrl.getDocUrl('cloud/metrics');
  }

  static displayRemainingLabels(number) {
    return `+${number}`;
  }

  showPreview(tokenID) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: tokenPreviewTemplate,
        controller: MetricsTokenPreviewCtrl,
        controllerAs: '$ctrl',
        resolve: {
          serviceName: () => this.serviceName,
          tokenID: () => tokenID,
        },
      },
    });
  }

  edit(tokenID, desc) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: tokenEditTemplate,
        controller: MetricsTokenEditCtrl,
        controllerAs: '$ctrl',
        resolve: {
          metricsType: () => 'name',
          metricsValue: () => desc,
          serviceName: () => this.serviceName,
          tokenID: () => tokenID,
        },
      },
      successHandler: () => this.getTokens(this.serviceName),
    });
  }

  delete(tokenID) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: tokenDeleteTemplate,
        controller: MetricsTokenDeleteCtrl,
        controllerAs: '$ctrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => this.serviceName,
          tokenID: () => tokenID,
        },
      },
      successHandler: () => this.getTokens(this.serviceName),
    });
  }
}
