import get from 'lodash/get';

export default class RemovePopConfigurationCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  removePopConfigure() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::remove-pop::confirm',
    );
    this.isLoading = true;
    return this.cloudConnectService
      .removePopConfiguration(
        this.cloudConnect.id,
        this.popId,
        this.interfaceId,
      )
      .then((task) => {
        this.pop.setDeleting();
        return this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_pop_remove_configuration_success',
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
                this.cloudConnect.removePopConfiguration(this.interfaceId);
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant(
            'cloud_connect_pop_remove_configuration_error',
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
