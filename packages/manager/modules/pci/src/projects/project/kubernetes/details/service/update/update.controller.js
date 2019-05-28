import get from 'lodash/get';

export default class kubernetesUpdateCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
  }

  $onInit() {
    this.isUpdating = false;
  }

  update() {
    this.isUpdating = true;
    return this.OvhApiCloudProjectKube.v6().updateVersion({
      serviceName: this.projectId,
      kubeId: this.kubeId,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('kube_service_update_success'),
      ))
      .catch(error => this.goBack(
        this.$translate.instant('kube_service_update_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
