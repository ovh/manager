import head from 'lodash/head';

angular.module('App').controller(
  'DedicatedServerFtpBackupController',
  class DedicatedServerFtpBackupController {
    constructor(
      $q,
      $scope,
      $stateParams,
      $translate,
      Alerter,
      DedicatedServerFeatureAvailability,
      Polling,
      Server,
    ) {
      this.$q = $q;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
      this.Polling = Polling;
      this.Server = Server;
    }

    $onInit() {
      this.$scope.ftpBackup = {
        model: null,
        use: 0,
      };
      this.$scope.ftpBackupTable = null;
      this.$scope.loadingTable = false;
      this.$scope.loading = true;
      this.$scope.doReloadAccess = false;
      this.$scope.featureAvailable = true;
      this.$scope.disable = {
        activeFtp: false,
        deleteFtp: false,
        passwordFtp: false,
      };
      this.$scope.ftpBackup.model = null;
      this.$scope.loading = true;
      this.$scope.featureAvailable = this.DedicatedServerFeatureAvailability.hasDedicatedServerBackupStorage();
      this.$scope.loadFtpBackupTable = this.loadFtpBackupTable.bind(this);

      this.$scope.$on('server.ftpbackup.reload', this.$onInit.bind(this));
      this.$scope.$on('server.ftpBackup.access.reload', () => {
        this.$scope.doReloadAccess = false;
        this.$scope.$broadcast('paginationServerSide.reload', 'backupTable');
      });
      this.$scope.$on('server.ftpBackup.access.load', () => {
        this.$scope.doReloadAccess = false;
        this.$scope.$broadcast(
          'paginationServerSide.loadPage',
          '1',
          'backupTable',
        );
      });
      this.$scope.$on('$destroy', () => {
        this.Polling.addKilledScope(this.$scope.$id);
      });
      this.$scope.$on('dedicated.ftpbackup.task.refresh', (e, task) => {
        this.startFtpBackupPollRefresh(task);
      });
      this.$scope.$on('dedicated.ftpbackup.active', (e, _task) => {
        this.$scope.disable.activeFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        this.startFtpBackupPollActive(task);
      });
      this.$scope.$on('dedicated.ftpbackup.delete', (e, _task) => {
        this.$scope.disable.deleteFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        this.startFtpBackupPollDelete(task);
      });
      this.$scope.$on('dedicated.ftpbackup.password', (e, _task) => {
        this.$scope.disable.passwordFtp = true;
        const task = _task.data;
        task.id = task.taskId;
        this.startFtpBackupPollPassword(task);
      });

      return this.$q
        .all({
          task: this.getTaskInProgress(),
          backup: this.Server.getFtpBackup(this.$stateParams.productId),
        })
        .then((result) => {
          if (result.backup.activated === true) {
            this.$scope.ftpBackup.model = result.backup;
            this.$scope.ftpBackup.use = result.backup.usage
              ? (result.backup.usage.value * result.backup.quota.value) / 100
              : 0;
          }
        })
        .finally(() => {
          this.$scope.loading = false;
        });
    }

    loadFtpBackupTable(elementsByPage, elementsToSkip) {
      this.$scope.loadingTable = true;
      return this.Server.getFtpBackupIp(
        this.$stateParams.productId,
        elementsByPage,
        elementsToSkip,
      )
        .then((results) => {
          this.$scope.ftpBackupTable = results;
          return results;
        })
        .catch((err) => {
          if (err.code !== 404) {
            this.Alerter.alertFromSWS(
              this.$translate.instant(
                'server_configuration_ftpbackup_table_fail',
              ),
              err,
              'server_tab_ftpbackup_alert',
            );
          }
        })
        .finally(() => {
          this.$scope.loadingTable = false;
        });
    }

    refreshTab() {
      return this.$scope.$broadcast('server.ftpBackup.access.reload');
    }

    getTaskInProgress() {
      this.$q
        .all({
          createBackupFTP: this.Server.getTaskInProgress(
            this.$stateParams.productId,
            'createBackupFTP',
          ),
          removeBackupFTP: this.Server.getTaskInProgress(
            this.$stateParams.productId,
            'removeBackupFTP',
          ),
          changePasswordBackupFTP: this.Server.getTaskInProgress(
            this.$stateParams.productId,
            'changePasswordBackupFTP',
          ),
          applyBackupFtpAcls: this.Server.getTaskInProgress(
            this.$stateParams.productId,
            'applyBackupFtpAcls',
          ),
        })
        .then((results) => {
          if (results.createBackupFTP.length > 0) {
            this.$scope.$broadcast(
              'dedicated.ftpbackup.active',
              head(results.createBackupFTP),
            );
          }
          if (results.removeBackupFTP.length > 0) {
            this.$scope.$broadcast(
              'dedicated.ftpbackup.delete',
              head(results.removeBackupFTP),
            );
          }
          if (results.changePasswordBackupFTP.length > 0) {
            this.$scope.$broadcast(
              'dedicated.ftpbackup.password',
              head(results.changePasswordBackupFTP),
            );
          }
          angular.forEach(results.applyBackupFtpAcls, (value) =>
            this.startFtpBackupPollRefresh(value),
          );
        });
    }

    startFtpBackupPollRefresh(task) {
      return this.Server.addTask(
        this.$stateParams.productId,
        task,
        this.$scope.$id,
        true,
      )
        .then((state) => {
          if (this.Polling.isResolve(state)) {
            if (!this.$scope.ipbackupCurrentEdit) {
              this.$scope.$broadcast('server.ftpBackup.access.reload');
            } else {
              this.$scope.doReloadAccess = true;
            }
          } else if (!this.Polling.isAlreadyExist(state)) {
            this.startFtpBackupPollRefresh(task);
          }
        })
        .catch(() => {
          if (!this.$scope.ipbackupCurrentEdit) {
            this.$scope.$broadcast('server.ftpBackup.access.reload');
          } else {
            this.$scope.doReloadAccess = true;
          }
        });
    }

    startFtpBackupPollActive(task) {
      return this.Server.addTaskFast(
        this.$stateParams.productId,
        task,
        this.$scope.$id,
      )
        .then((state) => {
          if (this.Polling.isResolve(state)) {
            this.Alerter.success(
              this.$translate.instant(
                'server_configuration_ftpbackup_activate_successfull',
              ),
              'server_tab_ftpbackup_alert',
            );
            this.$scope.disable.activeFtp = false;
            this.$scope.$broadcast('server.ftpbackup.reload');
          } else {
            this.startFtpBackupPollActive(task);
          }
        })
        .catch((data) => {
          this.$scope.disable.activeFtp = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_activate_failure',
            ),
            data,
            'server_tab_ftpbackup_alert',
          );
        });
    }

    startFtpBackupPollDelete(task) {
      return this.Server.addTaskFast(
        this.$stateParams.productId,
        task,
        this.$scope.$id,
      )
        .then((state) => {
          if (this.Polling.isResolve(state)) {
            this.$scope.disable.deleteFtp = false;
            this.Alerter.success(
              this.$translate.instant(
                'server_configuration_ftpbackup_delete_successfull',
              ),
              'server_tab_ftpbackup_alert',
            );
            this.$scope.$broadcast('server.ftpbackup.reload');
          } else {
            this.startFtpBackupPollDelete(task);
          }
        })
        .catch((data) => {
          this.$scope.disable.deleteFtp = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_delete_failure',
            ),
            data,
            'server_tab_ftpbackup_alert',
          );
        });
    }

    startFtpBackupPollPassword(task) {
      return this.Server.addTaskFast(
        this.$stateParams.productId,
        task,
        this.$scope.$id,
      )
        .then((state) => {
          if (this.Polling.isResolve(state)) {
            this.$scope.disable.passwordFtp = false;
            this.Alerter.success(
              this.$translate.instant(
                'server_configuration_ftpbackup_lost_password_successfull',
              ),
              'server_tab_ftpbackup_alert',
            );
          } else {
            this.startFtpBackupPollPassword(task);
          }
        })
        .catch((data) => {
          this.$scope.disable.passwordFtp = false;
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_lost_password_failure',
            ),
            data,
            'server_tab_ftpbackup_alert',
          );
        });
    }
  },
);
