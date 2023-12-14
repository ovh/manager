import { FTP_BACKUP_STORAGE_ALERT } from '../../ftp-backup.constants';

export default class DedicatedServerFtpBackupAccessUpdateController {
  /* @ngInject */
  constructor($rootScope, $stateParams, $translate, Alerter, Server) {
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
  }

  $onInit() {
    this.access = this.ipbackup;
    this.form = {
      access: angular.copy(this.access),
    };
  }

  /**
   * Update FTP backup access.
   * @return {Promise}
   */
  updateFtpBackupAccess() {
    this.isUpdating = true;
    return this.Server.putFtpBackupIp(
      this.$stateParams.productId,
      this.access.ipBlock,
      this.form.access.ftp,
      this.form.access.nfs,
      this.form.access.cifs,
    )
      .then(() => {
        this.$rootScope.$broadcast('server.ftpBackup.access.reload');
        this.Alerter.success(
          this.$translate.instant(
            'server_configuration_ftpbackup_set_success',
            { t0: this.access.ipBlock },
          ),
          FTP_BACKUP_STORAGE_ALERT,
        );
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_configuration_ftpbackup_set_fail', {
            t0: this.access.ipBlock,
          }),
          err,
          FTP_BACKUP_STORAGE_ALERT,
        ),
      )
      .finally(() => {
        this.isUpdating = false;
        this.goBack();
      });
  }
}
