import { FTP_BACKUP_STORAGE_ALERT } from '../../ftp-backup.constants';

export default class DedicatedServerFtpBackupAccessDeleteController {
  /* @ngInject */
  constructor($rootScope, $stateParams, $translate, Alerter, Server) {
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
  }

  $onInit() {
    this.access = this.ipbackup.ipBlock;
  }

  /**
   * Delete FTP backup access.
   * @return {Promise}
   */
  deleteFtpBackupAccess() {
    this.isDeleting = true;
    return this.Server.deleteFtpBackupIp(
      this.$stateParams.productId,
      this.access,
    )
      .then(() => {
        this.$rootScope.$broadcast('server.ftpBackup.access.load');
        this.Alerter.success(
          this.$translate.instant(
            'server_configuration_ftpbackup_access_delete_success',
            { t0: this.access },
          ),
          FTP_BACKUP_STORAGE_ALERT,
        );
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_access_delete_failure',
            { t0: this.access },
          ),
          err,
          FTP_BACKUP_STORAGE_ALERT,
        );
      })
      .finally(() => {
        this.isDeleting = false;
        this.goBack();
      });
  }
}
