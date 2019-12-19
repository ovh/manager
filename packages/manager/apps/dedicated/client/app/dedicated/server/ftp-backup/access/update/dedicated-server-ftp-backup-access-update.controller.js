import get from 'lodash/get';

angular.module('App')
  .controller('DedicatedServerFtpBackupAccessUpdateController', class DedicatedServerFtpBackupAccessUpdateController {
    constructor($rootScope, $scope, $stateParams, $translate, Alerter, Server) {
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    $onInit() {
      this.access = get(this.$scope, 'currentActionData', {});
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
      return this.Server
        .putFtpBackupIp(
          this.$stateParams.productId,
          this.access.ipBlock,
          this.form.access.ftp,
          this.form.access.nfs,
          this.form.access.cifs,
        )
        .then(() => {
          this.$rootScope.$broadcast('server.ftpBackup.access.reload');
          this.Alerter.success(this.$translate.instant('server_configuration_ftpbackup_set_success', { t0: this.access.ipBlock }), 'server_tab_ftpbackup_alert');
        })
        .catch((err) => this.Alerter.alertFromSWS(this.$translate.instant('server_configuration_ftpbackup_set_fail', { t0: this.access.ipBlock }), err, 'server_tab_ftpbackup_alert'))
        .finally(() => {
          this.isUpdating = false;
          this.$scope.resetAction();
        });
    }
  });
