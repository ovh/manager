import get from 'lodash/get';

export default class NashaPartitionAccessDeleteCtrl {
  /* @ngInject */
  constructor($translate, OvhApiDedicatedNasha, CucCloudMessage) {
    this.$translate = $translate;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.loading = false;
    this.toRemove = {
      serviceName: this.serviceName,
      partitionName: this.partition,
      access: this.access,
    };

    this.removeAccess = function removeAccess() {
      this.loading = true;
      this.OvhApiDedicatedNasha.Partition().Access().v6().remove({
        serviceName: this.toRemove.serviceName,
        partitionName: this.toRemove.partitionName,
        ip: this.toRemove.access.ip,
      }).$promise.then(result => this.goToPartitionAccessPage(
        this.$translate.instant('nasha_access_action_delete_success', {
          accessIp: this.toRemove.access.ip,
        }),
        'success',
        { access: this.toRemove.access, task: result.data.taskId },
        // $uibModalInstance.close({ access: this.toRemove.access, task: result.data.taskId });
        // this.CucCloudMessage.success(this.$translate.instant(
        // 'nasha_access_action_delete_success', { accessIp: this.toRemove.access.ip }));
      )).catch(error => this.goToPartitionAccessPage(
        this.$translate.instant('nasha_access_action_delete_failure', {
          accessIp: this.toRemove.access.ip,
          message: get(error, 'data.message'),
        }),
        'error',
      )).finally(() => {
        this.loading = false;
      });
    };

    this.dismiss = function dismiss() {
      this.goToPartitionAccessPage();
    };
  }
}
