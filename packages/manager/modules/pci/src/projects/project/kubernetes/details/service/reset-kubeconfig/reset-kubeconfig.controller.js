import get from 'lodash/get';

import { STATUS } from '../../constants';

export default class kubernetesResetCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.isReseting = false;
    this.isClusterReady = this.cluster.status === STATUS.READY;
  }

  reset() {
    this.isReseting = true;
    return this.OvhApiCloudProjectKube.v6()
      .resetKubeConfig(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        null,
      )
      .$promise.then(() => {
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_kubeconfig_success',
          ),
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_kubeconfig_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }
}
