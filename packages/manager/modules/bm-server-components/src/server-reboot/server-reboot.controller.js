export default class DedicatedServerRebootCtrl {
  /* @ngInject */
  constructor($translate, serverRebootService) {
    this.$translate = $translate;
    this.serverRebootService = serverRebootService;

    this.isRebooting = false;
  }

  reboot() {
    this.isRebooting = true;

    return this.serverRebootService
      .reboot(this.server.name)
      .then(() => {
        return this.goBack(
          this.$translate.instant('server_reboot_success', {
            t0: this.server.name,
          }),
          'success',
          true,
        );
      })
      .catch(() => {
        return this.goBack(
          this.$translate.instant('server_reboot_fail'),
          'danger',
          false,
        );
      })
      .finally(() => {
        this.isRebooting = false;
      });
  }
}
