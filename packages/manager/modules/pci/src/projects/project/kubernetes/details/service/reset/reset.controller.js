import get from 'lodash/get';

import { RESET_CONFIRMATION_INPUT, WORKER_NODE_POLICIES } from './constants';

export default class kubernetesResetCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.RESET_CONFIRMATION_INPUT = RESET_CONFIRMATION_INPUT;
    this.WORKER_NODE_POLICIES = WORKER_NODE_POLICIES;
  }

  $onInit() {
    this.isReseting = false;

    this.model = {
      version: null,
      workerNodesPolicy: WORKER_NODE_POLICIES.DELETE,
    };
  }

  /**
   * reset
   *
   * @memberof kubernetesResetCtrl
   */
  reset() {
    this.sendKubeTrack('details::service::reset::confirm');

    this.isReseting = true;
    return this.OvhApiCloudProjectKube.v6()
      .reset(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        {
          ...this.model,
        },
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_success',
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_kubernetes_service_reset_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        ),
      );
  }

  onResetModalCancel() {
    this.sendKubeTrack('details::service::reset::cancel');
    this.goBack();
  }
}
