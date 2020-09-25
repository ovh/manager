import set from 'lodash/set';

export default /* @ngInject */
($scope, $http, $stateParams, $translate, Polling, Alerter, Housing) => {
  const alert = 'housing_tab_ftpbackup_alert';
  const serviceName = $stateParams.productId;

  $scope.ftpBackup = {
    model: null,
    use: 0,
  };
  $scope.ftpBackupTable = null;
  $scope.loaders = {
    table: false,
    global: true,
    edit: false,
  };
  $scope.ipbackupCurrentEdit = null;
  $scope.ipbackupCurrentEditBack = null;
  $scope.doReloadAccess = false;
  $scope.backupIps = [];
  $scope.disable = {
    activeFtp: false,
    deleteFtp: false,
    passwordFtp: false,
  };

  // --------------LOAD------------------

  function startFtpBackupPollRefresh(task) {
    set(task, 'id', task.taskId);
    Housing.addTask($stateParams.productId, task, $scope.$id, true).then(
      (state) => {
        if (Polling.isResolve(state)) {
          if (!$scope.ipbackupCurrentEdit) {
            $scope.$broadcast('housing.ftpBackup.access.reload');
          } else {
            $scope.doReloadAccess = true;
          }
        } else {
          startFtpBackupPollRefresh(task);
        }
      },
      () => {
        if (!$scope.ipbackupCurrentEdit) {
          $scope.$broadcast('housing.ftpBackup.access.reload');
        } else {
          $scope.doReloadAccess = true;
        }
      },
    );
  }

  function getApply() {
    Housing.getTaskInProgress(
      $stateParams.productId,
      'applyBackupFtpAcls',
    ).then((taskTab) => {
      angular.forEach(taskTab, (value) => {
        startFtpBackupPollRefresh(value);
      });
    });
  }

  function getTaskInProgress() {
    Housing.getTaskInProgress($stateParams.productId, 'createBackupFTP').then(
      (taskTab) => {
        if (taskTab.length > 0) {
          $scope.$broadcast('housing.ftpbackup.active', taskTab[0].data);
        }
      },
    );
    Housing.getTaskInProgress($stateParams.productId, 'removeBackupFTP').then(
      (taskTab) => {
        if (taskTab.length > 0) {
          $scope.$broadcast('housing.ftpbackup.delete', taskTab[0].data);
        }
      },
    );
    Housing.getTaskInProgress(
      $stateParams.productId,
      'changePasswordBackupFTP',
    ).then((taskTab) => {
      if (taskTab.length > 0) {
        $scope.$broadcast('housing.ftpbackup.password', taskTab[0].data);
      }
    });
    getApply();
  }

  function loadFtpBackupIps() {
    return Housing.getFtpBackupIps($stateParams.productId).then((ips) => {
      if (ips.length === 0) {
        $scope.loaders.table = false;
      }

      $scope.backupIps = ips;
      $scope.reloadIps = !$scope.reloadIps;
    });
  }

  function init() {
    getTaskInProgress();

    $scope.ftpBackup.model = null;
    $scope.loaders.global = true;
    $scope.loaders.table = true;
    $scope.reloadIpsBackup = !$scope.reloadIpsBackup;

    loadFtpBackupIps();

    Housing.getFtpBackup($stateParams.productId)
      .then((data) => {
        $scope.ftpBackup.model = data;
        $scope.ftpBackup.use = data.quota.usage;
        $scope.ftpBackup.usage = (data.quota.usage / data.quota.value) * 100;
        $scope.ftpBackup.model.login = serviceName;
      })
      .finally(() => {
        $scope.loaders.global = false;
      });
  }

  init();

  $scope.transformItem = function transformItem(id) {
    return Housing.getFtpBackupIpDetail($stateParams.productId, id);
  };

  $scope.onTransformItemDone = function onTransformItemDone() {
    $scope.loaders.table = false;
  };

  // --------------TABLE ACCESS LOADING------------------

  $scope.reloadIpsBackup = function reloadIpsBackup() {
    $scope.loaders.table = true;
    loadFtpBackupIps();
  };

  // --------------EDIT ACCESS------------------

  $scope.setIpBackupCurrentEdit = function setIpBackupCurrentEdit(
    ipbackup,
    _inputToRevert,
  ) {
    let inputToRevert = _inputToRevert;
    $scope.ipbackupCurrentEdit = angular.copy(ipbackup);
    $scope.ipbackupCurrentEdit[inputToRevert] = !$scope.ipbackupCurrentEdit[
      inputToRevert
    ];
    $scope.ipbackupCurrentEditBack = ipbackup;
    inputToRevert = !inputToRevert;
  };

  function startEditPolling(ipBlock) {
    return Housing.getFtpBackupIpDetail($stateParams.productId, ipBlock).then(
      (backup) => {
        if (!backup.isApplied) {
          setTimeout(() => {
            startEditPolling(ipBlock);
          }, 5000);
        } else {
          $scope.reloadIpsBackup();
        }
      },
    );
  }

  function conditionnalReloadAccess() {
    if ($scope.doReloadAccess) {
      $scope.doReloadAccess = false;
      $scope.refreshTab();
    }
  }

  $scope.saveIpBackupCurrentEdit = function saveIpBackupCurrentEdit() {
    if (
      $scope.ipbackupCurrentEdit.cifs ||
      $scope.ipbackupCurrentEdit.ftp ||
      $scope.ipbackupCurrentEdit.nfs
    ) {
      $scope.loaders.edit = true;
      Housing.putFtpBackupIp(
        $stateParams.productId,
        $scope.ipbackupCurrentEdit.ipBlock,
        $scope.ipbackupCurrentEdit.ftp,
        $scope.ipbackupCurrentEdit.nfs,
        $scope.ipbackupCurrentEdit.cifs,
      )
        .then(
          () => {
            Alerter.success(
              $translate.instant(
                'housing_configuration_ftpbackup_set_success',
                { t0: $scope.ipbackupCurrentEdit.ipBlock },
              ),
              alert,
            );
            getApply();
            startEditPolling($scope.ipbackupCurrentEdit.ipBlock);
          },
          (data) => {
            Alerter.alertFromSWS(
              $translate.instant('housing_configuration_ftpbackup_set_fail', {
                t0: $scope.ipbackupCurrentEdit.ipBlock,
              }),
              data,
              alert,
            );
            conditionnalReloadAccess();
          },
        )
        .finally(() => {
          $scope.ipbackupCurrentEditBack = null;
          $scope.ipbackupCurrentEdit = null;
          $scope.loaders.edit = false;
        });
    }
  };

  $scope.cancelIpBackupCurrentEdit = function cancelIpBackupCurrentEdit() {
    $scope.ipbackupCurrentEdit = null;
    $scope.ipbackupCurrentEditBack = null;
    conditionnalReloadAccess();
  };

  // --------------TASK POLLING------------------

  $scope.$on('$destroy', () => {
    Polling.addKilledScope($scope.$id);
  });

  // --------------TASK ACCESS TABLE------------------

  $scope.$on('housing.ftpbackup.task.refresh', (e, task) => {
    startFtpBackupPollRefresh(task);
  });

  // --------------TASK ACTIVE BACKUP------------------

  function startFtpBackupPollActive(task) {
    set(task, 'id', task.taskId);
    Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_activate_successfull',
            ),
            alert,
          );
          $scope.disable.activeFtp = false;
          $scope.$broadcast('housing.ftpbackup.reload');
        } else {
          startFtpBackupPollActive(task);
        }
      },
      (data) => {
        $scope.disable.activeFtp = false;
        Alerter.alertFromSWS(
          $translate.instant(
            'housing_configuration_ftpbackup_activate_failure',
          ),
          data,
          alert,
        );
      },
    );
  }

  $scope.$on('housing.ftpbackup.active', (e, task) => {
    $scope.disable.activeFtp = true;
    startFtpBackupPollActive(task);
  });

  // --------------TASK DISABLE+DELETE BACKUP------------------

  function startFtpBackupPollDelete(task) {
    Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.deleteFtp = false;
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_delete_successfull',
            ),
            alert,
          );
          $scope.$broadcast('housing.ftpbackup.reload');
        } else {
          startFtpBackupPollDelete(task);
        }
      },
      (data) => {
        $scope.disable.deleteFtp = false;
        Alerter.alertFromSWS(
          $translate.instant('housing_configuration_ftpbackup_delete_failure'),
          data,
          alert,
        );
      },
    );
  }

  $scope.$on('housing.ftpbackup.delete', (e, task) => {
    $scope.disable.deleteFtp = true;
    startFtpBackupPollDelete(task);
  });

  // --------------TASK RENEW PASSWORD BACKUP------------------

  function startFtpBackupPollPassword(task) {
    Housing.addTaskFast($stateParams.productId, task, $scope.$id).then(
      (state) => {
        if (Polling.isResolve(state)) {
          $scope.disable.passwordFtp = false;
          Alerter.success(
            $translate.instant(
              'housing_configuration_ftpbackup_lost_password_successfull',
            ),
            alert,
          );
        } else {
          startFtpBackupPollPassword(task);
        }
      },
      () => {
        $scope.disable.passwordFtp = false;
      },
    );
  }

  $scope.$on('housing.ftpbackup.password', (e, task) => {
    $scope.disable.passwordFtp = true;
    startFtpBackupPollPassword(task);
  });

  $scope.$on('housing.ftpbackup.reload', init);
  $scope.$on('housing.ftpbackup.refresh', $scope.reloadIpsBackup);
  $scope.$on('housing.ftpBackup.access.reload', init);
  $scope.$on('housing.ftpBackup.access.load', $scope.reloadIpsBackup);
};
