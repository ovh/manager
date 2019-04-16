import get from 'lodash/get';

import { RESET_CONFIRMATION_INPUT, WORKER_NODE_POLICIES } from './constants';

export default class kubernetesResetCtrl {
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
    this.RESET_CONFIRMATION_INPUT = RESET_CONFIRMATION_INPUT;
    this.WORKER_NODE_POLICIES = WORKER_NODE_POLICIES;

    // other attributes used in view
    this.availableVersions = null;

    this.model = {
      version: null,
    };

    this.loading = {
      init: false,
      reset: false,
    };
  }

  $onInit() {
    this.loading.init = true;

    // reset models and loading
    this.loading.reset = false;
    this.workerNodesPolicy = WORKER_NODE_POLICIES.DELETE;

    // get the available options value for versions
    return this.Kubernetes.getSchema()
      .then((kubeSchema) => {
        this.availableVersions = get(kubeSchema, 'models[\'kube.Version\'].enum');
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('kube_service_reset_load_error', {
            message: get(error, 'data.message', ''),
          }),
        );
        this.$uibModalInstance.close();
      })
      .finally(() => {
        this.loading.init = false;
      });
  }

  /**
   * Closes the info pop-up
   *
   * @memberof kubernetesResetCtrl
   */
  cancel() {
    this.$uibModalInstance.dismiss();
  }

  /**
   * reset
   *
   * @memberof kubernetesResetCtrl
   */
  reset() {
    this.loading.reset = true;
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.Kubernetes
        .resetCluster(this.serviceName, {
          workerNodesPolicy: this.workerNodesPolicy,
          version: this.model.version,
        })
        .then(() => this.CucCloudMessage.success(this.$translate.instant('kube_service_reset_success')))
        .catch(err => this.CucCloudMessage.error(this.$translate.instant('kube_service_reset_error', { message: get(err, 'data.message', '') })))
        .finally(() => {
          this.loading = false;
          this.CucControllerHelper.scrollPageToTop();
          this.$uibModalInstance.close();
          this.Kubernetes.resetClusterCache();
          this.$rootScope.$broadcast('pci.projects.project.kubernetes.service.refresh');
        }),
    });
    return this.saving.load();
  }
}
