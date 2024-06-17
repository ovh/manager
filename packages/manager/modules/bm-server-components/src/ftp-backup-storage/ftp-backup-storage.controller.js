import head from 'lodash/head';
import {
  FTP_BACKUP_DOCUMENTATION_LINK,
  FTP_BACKUP_STORAGE_ALERT,
  FTP_BACK_UP_USAGE_LIMIT,
} from './ftp-backup.constants';

export default class FtpBackupStorageController {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    $state,
    Alerter,
    coreConfig,
    DedicatedServerFeatureAvailability,
    Polling,
    Server,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$state = $state;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
    this.DedicatedServerFeatureAvailability = DedicatedServerFeatureAvailability;
    this.Polling = Polling;
    this.Server = Server;
    this.FTP_BACKUP_STORAGE_ALERT = FTP_BACKUP_STORAGE_ALERT;
    this.FTP_BACK_UP_USAGE_LIMIT = FTP_BACK_UP_USAGE_LIMIT;
  }

  $onInit() {
    this.guideLink =
      FTP_BACKUP_DOCUMENTATION_LINK[this.coreConfig.getUser().ovhSubsidiary] ||
      FTP_BACKUP_DOCUMENTATION_LINK.DEFAULT;

    this.ftpBackup = {
      model: null,
      use: 0,
    };
    this.ftpBackupTable = null;
    this.loadingTable = false;
    this.doReloadAccess = false;

    this.disable = {
      activeFtp: false,
      deleteFtp: false,
      passwordFtp: false,
    };
    this.ftpBackup.model = null;
    this.loading = true;
    this.featureAvailable = this.DedicatedServerFeatureAvailability.hasDedicatedServerBackupStorage();
    this.$scope.loadFtpBackupTable = this.loadFtpBackupTable.bind(this);
    this.$scope.$on('server.ftpbackup.reload', this.$onInit.bind(this));
    this.$scope.$on('server.ftpBackup.access.reload', () => {
      this.doReloadAccess = false;
      this.$scope.$broadcast('paginationServerSide.reload', 'backupTable');
    });
    this.$scope.$on('server.ftpBackup.access.load', () => {
      this.doReloadAccess = false;
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
      this.disable.activeFtp = true;
      const task = _task.data;
      task.id = task.taskId;
      this.startFtpBackupPollActive(task);
    });
    this.$scope.$on('dedicated.ftpbackup.delete', (e, _task) => {
      this.disable.deleteFtp = true;
      const task = _task.data;
      task.id = task.taskId;
      this.startFtpBackupPollDelete(task);
    });
    this.$scope.$on('dedicated.ftpbackup.password', (e, _task) => {
      this.disable.passwordFtp = true;
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
        this.ftpBackup.model = result.backup;

        this.isOrderable = this.ftpBackup.model.canOrder;
        this.isActivable = this.ftpBackup.model.activate;
        this.isActivated = this.ftpBackup.model.activated;
        this.canBeActivated =
          !this.isActivated && (this.isActivable || this.isOrderable);
        this.isNotAvailable =
          !this.isOrderable && !this.isActivable && !this.isActivated;

        this.ftpBackup.use = result.backup.usage
          ? (result.backup.usage.value * result.backup.quota.value) / 100
          : 0;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loadFtpBackupTable(elementsByPage, elementsToSkip) {
    this.loadingTable = true;
    return this.Server.getFtpBackupIp(
      this.$stateParams.productId,
      elementsByPage,
      elementsToSkip,
    )
      .then((results) => {
        this.ftpBackupTable = results;
        return results;
      })
      .catch((err) => {
        if (err.code !== 404) {
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              'server_configuration_ftpbackup_table_fail',
            ),
            err,
            FTP_BACKUP_STORAGE_ALERT,
          );
        }
      })
      .finally(() => {
        this.loadingTable = false;
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
          if (!this.ipbackupCurrentEdit) {
            this.$scope.$broadcast('server.ftpBackup.access.reload');
          } else {
            this.doReloadAccess = true;
          }
        } else if (!this.Polling.isAlreadyExist(state)) {
          this.startFtpBackupPollRefresh(task);
        }
      })
      .catch(() => {
        if (!this.ipbackupCurrentEdit) {
          this.$scope.$broadcast('server.ftpBackup.access.reload');
        } else {
          this.doReloadAccess = true;
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
            FTP_BACKUP_STORAGE_ALERT,
          );
          this.disable.activeFtp = false;
          this.$scope.$broadcast('server.ftpbackup.reload');
        } else {
          this.startFtpBackupPollActive(task);
        }
      })
      .catch((data) => {
        this.disable.activeFtp = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_activate_failure',
          ),
          data,
          FTP_BACKUP_STORAGE_ALERT,
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
          this.disable.deleteFtp = false;
          this.Alerter.success(
            this.$translate.instant(
              'server_configuration_ftpbackup_delete_successfull',
            ),
            FTP_BACKUP_STORAGE_ALERT,
          );
          this.$scope.$broadcast('server.ftpbackup.reload');
        } else {
          this.startFtpBackupPollDelete(task);
        }
      })
      .catch((data) => {
        this.disable.deleteFtp = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_delete_failure',
          ),
          data,
          FTP_BACKUP_STORAGE_ALERT,
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
          this.disable.passwordFtp = false;
          this.Alerter.success(
            this.$translate.instant(
              'server_configuration_ftpbackup_lost_password_successfull',
            ),
            FTP_BACKUP_STORAGE_ALERT,
          );
        } else {
          this.startFtpBackupPollPassword(task);
        }
      })
      .catch((data) => {
        this.disable.passwordFtp = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant(
            'server_configuration_ftpbackup_lost_password_failure',
          ),
          data,
          FTP_BACKUP_STORAGE_ALERT,
        );
      });
  }
}
