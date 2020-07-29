import get from 'lodash/get';

import { DELETE_CONFIRMATION_INPUT } from './constants';

export default class KubernetesNodePoolsDeleteCtrl {
  /* @ngInject */
  constructor($translate, Kubernetes) {
    this.$translate = $translate;
    this.Kubernetes = Kubernetes;
    this.DELETE_CONFIRMATION_INPUT = DELETE_CONFIRMATION_INPUT;
  }

  $onInit() {
    this.isDeleting = false;
  }

  deletePoolNode() {
    this.isDeleting = true;
    return this.Kubernetes
      .deleteNodePool(
        this.projectId,
        this.kubeId,
        this.nodePoolId,
      )
      .then(() =>
        this.goBack(this.$translate.instant('kube_node_pool_delete_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_node_pool_delete_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }
}
