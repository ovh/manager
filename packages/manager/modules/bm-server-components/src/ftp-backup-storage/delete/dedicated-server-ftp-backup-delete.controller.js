import { FTP_BACKUP_STORAGE_ALERT } from '../ftp-backup.constants';

export default class DeleteFtpBackupCtrl {
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

  deleteFtpBackup() {
    this.loading = true;
    this.Server.deleteFtpBackup(this.$stateParams.productId)
      .then(
        () => {
          this.Alerter.success(
            this.$translate.instant(
              'server_configuration_ftpbackup_delete_success',
            ),
            FTP_BACKUP_STORAGE_ALERT,
          );
        },
        (data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_delete_failure',
            ),
            data,
            FTP_BACKUP_STORAGE_ALERT,
          );
        },
      )
      .finally(() => {
        this.loading = false;
        this.goBack();
      });
  }
}
