import get from 'lodash/get';

export default class RemoveVrackCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  removeDatacenter() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::remove-datacenter-configuration::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .removeDatacenterConfiguration(
        this.cloudConnect.id,
        this.popId,
        this.datacenterId,
      )
      .then((task) => {
        this.datacenter.setDeleting();
        return this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_datacenter_remove_success',
              {
                tasksUrl: this.tasksHref,
              },
            ),
          },
          'success',
          false,
        ).then(() => {
          if (task) {
            this.cloudConnectService
              .checkTaskStatus(this.cloudConnect.id, task.id)
              .finally(() => {
                this.cloudConnect.removeDcConfiguration(this.datacenterId);
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_datacenter_remove_error', {
            message: get(error, 'data.message', error.message),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
