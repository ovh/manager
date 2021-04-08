import get from 'lodash/get';

import { TERMINATE_INPUT } from './constants';

export default class kubernetesTerminateCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube, OvhApiKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.OvhApiKube = OvhApiKube;
    this.TERMINATE_INPUT = TERMINATE_INPUT;
  }

  $onInit() {
    this.isDeleting = false;
  }

  terminate() {
    this.sendKubeTrack('details::service::terminate::confirm');

    this.isDeleting = true;
    return (this.isLegacyCluster
      ? this.OvhApiKube.v6().terminate({
          serviceName: this.kubeId,
        }).$promise
      : this.OvhApiCloudProjectKube.v6().delete({
          serviceName: this.projectId,
          kubeId: this.kubeId,
        }).$promise
    )
      .then(() =>
        this.goBack(this.$translate.instant('kube_service_terminate_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_service_terminate_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  onTerminateModalCancel() {
    this.sendKubeTrack('details::service::terminate::cancel');
    this.goBack();
  }
}
