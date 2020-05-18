import get from 'lodash/get';

import { DELETE_CONFIRMATION_INPUT } from './constants';

export default class KubernetesNodesDeleteCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deleteNode() {
    this.isDeleting = true;
    return this.OvhApiCloudProjectKube.Node()
      .v6()
      .delete({
        serviceName: this.projectId,
        kubeId: this.kubeId,
        nodeId: this.nodeId,
      })
      .$promise.then(() =>
        this.goBack(this.$translate.instant('kube_nodes_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_nodes_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
