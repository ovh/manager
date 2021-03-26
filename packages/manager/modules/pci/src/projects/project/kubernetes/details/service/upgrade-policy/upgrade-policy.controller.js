import get from 'lodash/get';

import { UPGRADE_POLICIES } from './upgrade-policy.constants';

export default class kubernetesUpgradePolicyCtrl {
  /* @ngInject */
  constructor($translate, OvhApiCloudProjectKube) {
    this.$translate = $translate;
    this.OvhApiCloudProjectKube = OvhApiCloudProjectKube;

    this.UPGRADE_POLICIES = UPGRADE_POLICIES;
  }

  $onInit() {
    this.isUpgrading = false;
    this.updatePolicy = this.cluster.updatePolicy;
  }

  updateUpgradePolicy() {
    this.sendKubeTrack('details::service::upgradePolicy::confirm');

    this.isUpgrading = true;
    return this.OvhApiCloudProjectKube.v6()
      .updatePolicy(
        {
          serviceName: this.projectId,
          kubeId: this.kubeId,
        },
        {
          updatePolicy: this.updatePolicy,
        },
      )
      .$promise.then(() =>
        this.goBack(
          this.$translate.instant('kube_service_upgrade_policy_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('kube_service_upgrade_policy_error', {
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  onUpgradePolicyModalCancel() {
    this.sendKubeTrack('details::service::upgradePolicy::cancel');
    this.goBack();
  }
}
