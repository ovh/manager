import { FTP_BACKUP_STORAGE_ALERT } from '../ftp-backup.constants';

export default class ActivateFtpBackupCtrl {
  /* @ngInject */
  constructor($stateParams, $translate, Server, Alerter) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Server = Server;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = false;
  }

  activateFtpBackup() {
    this.loading = true;
    this.Server.activateFtpBackup(this.$stateParams.productId)
      .then(
        () => {
          this.Alerter.success(
            this.$translate.instant(
              'server_configuration_ftpbackup_activate_success',
            ),
            FTP_BACKUP_STORAGE_ALERT,
          );
        },
        (data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_activate_failure',
            ),
            data.data,
            FTP_BACKUP_STORAGE_ALERT,
          );
        },
      )
      .finally(() => {
        this.goBack();
        this.loading = false;
      });
  }
}
