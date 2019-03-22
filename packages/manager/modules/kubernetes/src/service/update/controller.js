import get from 'lodash/get';

export default class kubernetesUpdateCtrl {
  /* @ngInject */
  constructor($rootScope, $stateParams, $translate, $uibModalInstance, CucCloudMessage,
    CucControllerHelper, Kubernetes) {
    this.$rootScope = $rootScope;
    this.serviceName = $stateParams.serviceName;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.Kubernetes = Kubernetes;
  }

  $onInit() {
    this.loading = false;
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  update() {
    this.loading = true;
    this.CucCloudMessage.flushChildMessage();
    this.updating = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.Kubernetes
        .updateKubernetesVersion(this.serviceName)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('kube_service_update_success')))
        .catch(err => this.CucCloudMessage.error(this.$translate.instant('kube_service_update_error', { message: get(err, 'data.message', '') })))
        .finally(() => {
          this.loading = false;
          this.CucControllerHelper.scrollPageToTop();
          this.$uibModalInstance.close();
          this.$rootScope.$broadcast('kube.service.refresh');
        }),
    });
    return this.updating.load();
  }
}
