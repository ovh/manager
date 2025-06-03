import get from 'lodash/get';

export default class UnlockPortCtrl {
  /* @ngInject */
  constructor($q, $translate, cloudConnectService) {
    this.$q = $q;
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
    return this.cloudConnectService
      .unlockInterface(this.cloudConnect.id, this.interfaceId)
      .then((task) => {
        this.interface.setEnabling(true);
        return this.goBack(
          this.$translate.instant('cloud_connect_pop_unblock_port_success', {
            port: this.interfaceId,
            tasksUrl: this.tasksHref,
          }),
          'success',
          false,
        ).then(() => {
          if (task) {
            return this.cloudConnectService
              .checkTaskStatus(this.cloudConnect.id, task.id)
              .finally(() => {
                const cloudConnectInterface = this.cloudConnect.getInterface(
                  this.interface.id,
                );
                cloudConnectInterface.enable();
              });
          }
          return this.$q.resolve();
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
