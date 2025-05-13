import {
  DEDICATED_SERVER_FTP_BACKUP_IP_BLOCKS_LIMIT,
  FTP_BACKUP_STORAGE_ALERT,
} from '../../ftp-backup.constants';

export default class AddAccessFtpBackupCtrl {
  /* @ngInject */
  constructor($rootScope, $stateParams, $translate, Alerter, Server) {
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Server = Server;
    this.ipBlocksLimit = DEDICATED_SERVER_FTP_BACKUP_IP_BLOCKS_LIMIT;
    this.addFtpBackup = this.addFtpBackup.bind(this);
  }

  $onInit() {
    this.existingIpBlocks = this.results;
    this.access = {
      listIp: [],
      ip: null,
      ftp: false,
      cifs: false,
      nfs: false,
    };
    this.loading = false;
  }

  load() {
    return () => {
      this.loading = true;
      return this.Server.getAuthorizableBlocks(this.$stateParams.productId)
        .then((list) => {
          this.access.listIp = list;
        })
        .catch(({ data }) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_access_add_ip_failure',
            ),
            data,
            FTP_BACKUP_STORAGE_ALERT,
          );
          this.goBack();
        })
        .finally(() => {
          this.loading = false;
        });
    };
  }

  addFtpBackup() {
    const resultMessages = {
      OK: this.$translate.instant(
        'server_configuration_ftpbackup_access_add_success',
      ),
      PARTIAL: this.$translate.instant(
        'server_configuration_ftpbackup_access_add_partial',
      ),
      ERROR: this.$translate.instant(
        'server_configuration_ftpbackup_access_add_failure',
      ),
    };

    this.loading = true;

    this.Server.postFtpBackupIp(
      this.$stateParams.productId,
      this.access.ip,
      this.access.ftp,
      this.access.nfs,
      this.access.cifs,
    )
      .then((data) => {
        data.results.forEach((task) => {
          this.$rootScope.$broadcast('dedicated.ftpbackup.task.refresh', task);
        });
        this.$rootScope.$broadcast('server.ftpBackup.access.load');
        this.Alerter.alertFromSWSBatchResult(
          resultMessages,
          data,
          FTP_BACKUP_STORAGE_ALERT,
        );
      })
      .catch((data) => {
        this.Alerter.alertFromSWSBatchResult(
          resultMessages,
          data,
          FTP_BACKUP_STORAGE_ALERT,
        );
      })
      .finally(() => {
        this.goBack();
        this.loading = false;
      });
  }

  isIpBlocksLengthValid() {
    if (this.access.ip) {
      return (
        this.existingIpBlocks.length + this.access.ip.length <=
        this.ipBlocksLimit
      );
    }
    return true;
  }
}
