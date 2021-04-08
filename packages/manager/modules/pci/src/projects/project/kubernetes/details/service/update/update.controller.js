import get from 'lodash/get';

import { UPDATE_STRATEGY } from './update.constants';

export default class kubernetesUpdateCtrl {
  /* @ngInject */
  constructor($translate, atInternet, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;
    this.tracking = {
      case: null,
    };
  }

  $onInit() {
    this.tracking.case = this.isMinorVersionUpgrade
      ? 'updateVersion'
      : 'updateSecurity';
    this.atInternet.trackPage({
      name: `${this.kubeTrackPrefix}::${this.tracking.case}`,
    });

    this.isUpdating = false;
  }

  update() {
    this.trackClick(`${this.kubeTrackPrefix}::${this.tracking.case}::confirm`);

    this.isUpdating = true;
    return this.OvhApiCloudProjectKube.v6()
      .updateVersion(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        {
          strategy: this.isMinorVersionUpgrade
            ? UPDATE_STRATEGY.MINOR
            : UPDATE_STRATEGY.PATCH,
        },
      )
      .$promise.then(() =>
        this.goBack(this.$translate.instant('kube_service_update_success')),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_service_update_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  onUpdateModalCancel() {
    this.trackClick(`${this.kubeTrackPrefix}::${this.tracking.case}::cancel`);
    this.goBack();
  }
}
