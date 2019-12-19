(() => {
  class MetricsTokenCtrl {
    constructor($scope, $stateParams, $translate, CucControllerHelper, MetricService, ovhDocUrl) {
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
      this.MetricService.getTokens(serviceName)
        .then((data) => {
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
          templateUrl: 'app/dbaas/dbaas-metrics/token/preview/metrics-token-preview.html',
          controller: 'MetricsTokenPreviewCtrl',
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
          templateUrl: 'app/dbaas/dbaas-metrics/token/edit/metrics-token-edit.html',
          controller: 'MetricsTokenEditCtrl',
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
          templateUrl: 'app/dbaas/dbaas-metrics/token/delete/metrics-token-delete.html',
          controller: 'MetricsTokenDeleteCtrl',
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

  angular.module('managerApp').controller('MetricsTokenCtrl', MetricsTokenCtrl);
})();
