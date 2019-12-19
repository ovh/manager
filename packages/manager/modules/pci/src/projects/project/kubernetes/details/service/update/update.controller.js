import get from 'lodash/get';

import { UPDATE_STRATEGY } from './update.constants';

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
    }, {
      strategy: this.isMinorVersionUpgrade ? UPDATE_STRATEGY.MINOR : UPDATE_STRATEGY.PATCH,
    }).$promise
      .then(() => this.goBack(
        this.$translate.instant('kube_service_update_success'),
      ))
      .catch((error) => this.goBack(
        this.$translate.instant('kube_service_update_error', {
          message: get(error, 'data.message'),
        }), 'error',
      ));
  }
}
