import get from 'lodash/get';

import { TERMINATE_INPUT } from './constants';

export default class kubernetesTerminateCtrl {
  /* @ngInject */
  constructor($rootScope, $stateParams, $translate, $uibModalInstance, CucCloudMessage,
    CucControllerHelper, Kubernetes) {
    // dependencies injections
    this.$rootScope = $rootScope;
    this.serviceName = $stateParams.serviceName;
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucControllerHelper = CucControllerHelper;
    this.Kubernetes = Kubernetes;
    this.TERMINATE_INPUT = TERMINATE_INPUT;
  }

  $onInit() {
    this.availableVersions = null;

    this.model = {
      version: null,
    };

    this.loading = {
      terminate: false,
    };
  }

  /**
   * Closes the info pop-up
   *
   * @memberof kubernetesTerminateCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }

  /**
   * reset
   *
   * @memberof kubernetesTerminateCtrl
   */
  terminate() {
    this.loading.terminate = true;
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.Kubernetes
        .terminate(this.serviceName)
        .then(() => this.CucCloudMessage.success(this.$translate.instant('kube_service_terminate_success')))
        .catch(err => this.CucCloudMessage.error(this.$translate.instant('kube_service_terminate_error', { message: get(err, 'data.message', '') })))
        .finally(() => {
          this.loading.terminate = false;
          this.CucControllerHelper.scrollPageToTop();
          this.$uibModalInstance.close();
          this.Kubernetes.resetCache();
          this.$rootScope.$broadcast('pci.projects.project.kubernetes.details.service.refresh');
        }),
    });
    return this.saving.load();
  }
}
