import get from 'lodash/get';

angular.module('App').controller(
  'DedicatedServerFtpBackupAccessDeleteController',
  class DedicatedServerFtpBackupAccessDeleteController {
    constructor($rootScope, $scope, $stateParams, $translate, Alerter, Server) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    $onInit() {
      this.access = get(this.$scope, 'currentActionData.ipBlock', {});
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
            'server_tab_ftpbackup_alert',
          );
        })
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_access_delete_failure',
              { t0: this.access },
            ),
            err,
            'server_tab_ftpbackup_alert',
          ),
        )
        .finally(() => {
          this.isDeleting = false;
          this.$scope.resetAction();
        });
    }
  },
);
