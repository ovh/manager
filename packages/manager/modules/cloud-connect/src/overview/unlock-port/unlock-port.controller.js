import get from 'lodash/get';

export default class UnlockPortCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  unlockPort() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::unlock-port::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .unlockInterface(this.cloudConnect.id, this.interfaceId)
      .then((task) => {
        this.interface.setEnabling(true);
        this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_pop_unblock_port_success',
              {
                port: this.interfaceId,
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
                this.interface.enable();
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_pop_unblock_port_error', {
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
