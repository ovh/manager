import get from 'lodash/get';

export default class CloudConnectDacenterRemoveExtraCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  removeRouting() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::remove-datacenter-extra-configuration::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .removeDatacenterConfigurationExtra(
        this.cloudConnect.id,
        this.popId,
        this.datacenterId,
        this.extraId,
      )
      .then((task) => {
        this.extra.setDeleting();
        return this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_datacenter_remove_routing_success',
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
                this.datacenter.removeExtraConfiguration(this.extraId);
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_datacenter_remove_routing_error',
            {
              message: get(error, 'data.message', error.message),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
