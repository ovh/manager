import get from 'lodash/get';

export default class LockPortCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  lockPort() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::lock-port::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .lockInterface(this.cloudConnect.id, this.interfaceId)
      .then((task) => {
        this.interface.setDisabling(true);
        this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_pop_block_port_success',
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
                this.interface.disable();
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_pop_block_port_error', {
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
