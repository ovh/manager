import difference from 'lodash/difference';
import map from 'lodash/map';
import set from 'lodash/set';

// --------------ADD ACCESS------------------

export default /* @ngInject */ (
  $rootScope,
  $scope,
  $translate,
  Housing,
  $stateParams,
  Alerter,
) => {
  const alert = 'housing_tab_ftpbackup_alert';
  const ips = map($scope.currentActionData, (ip) => ip.ipBlock);

  $scope.access = {
    listIp: [],
    ip: null,
    ftp: false,
    cifs: false,
    nfs: false,
  };
  $scope.loading = false;

  $scope.load = function load() {
    $scope.loading = true;
    Housing.getAuthorizableBlocks($stateParams.productId).then(
      (list) => {
        $scope.access.listIp = difference(list, ips);

        $scope.loading = false;
      },
      (data) => {
        $scope.resetAction();
        Alerter.alertFromSWS(
          $translate.instant(
            'housing_configuration_ftpbackup_access_add_ip_failure',
          ),
          data,
          alert,
        );
      },
    );
  };

  $scope.addFtpBackup = function addFtpBackup() {
    const resultMessages = {
      OK: $translate.instant(
        'housing_configuration_ftpbackup_access_add_success',
      ),
      PARTIAL: $translate.instant(
        'housing_configuration_ftpbackup_access_add_partial',
      ),
      ERROR: $translate.instant(
        'housing_configuration_ftpbackup_access_add_failure',
      ),
    };

    $scope.loading = true;

    Housing.postFtpBackupIp(
      $stateParams.productId,
      $scope.access.ip,
      $scope.access.ftp,
      $scope.access.nfs,
      $scope.access.cifs,
    )
      .then(
        (data) => {
          angular.forEach(data, (task) => {
            set(task, 'id', task.taskId);
            $rootScope.$broadcast('housing.ftpbackup.task.refresh', task);
          });
          $rootScope.$broadcast('housing.ftpBackup.access.load');
          Alerter.success(resultMessages.OK, alert);
        },
        (data) => {
          Alerter.alertFromSWSBatchResult(resultMessages.ERROR, data, alert);
        },
      )
      .finally(() => {
        $scope.resetAction();
      });
  };
};
