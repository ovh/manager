angular
  .module('App')
  .controller(
    'NasPartitionSnapshotCtrl',
    function NasPartitionSnapshotCtrl(
      $scope,
      $stateParams,
      $rootScope,
      $translate,
      Nas,
      Alerter,
    ) {
      const alerterId = 'NasAlert';
      const self = this;

      self.snapshots = {
        model: null,
        save: null,
      };
      self.partitionName = $stateParams.partitionName;

      self.disable = {
        taskDoing: false,
      };

      function getTaskInProgress() {
        Nas.getTaskInProgressOf(
          $stateParams.nasId,
          'clusterLeclercSnapshotUpdate',
        ).then((data) => {
          self.disable.taskDoing = data.length > 0;
        });
      }

      function load() {
        self.loading = true;
        self.snapshots.model = null;
        self.snapshots.save = null;

        Nas.getSnapshots($stateParams.nasId, self.partitionName).then(
          (results) => {
            self.snapshots.model = results;
            self.loading = false;
          },
          (data) => {
            self.loading = false;
            Alerter.alertFromSWS(
              $translate.instant('nas_snapshot_loading_error'),
              data,
              alerterId,
            );
          },
        );
        getTaskInProgress();
      }

      self.editSnapshot = function editSnapshot() {
        self.snapshots.save = angular.copy(self.snapshots.model);
      };

      self.cancelSnapshot = function cancelSnapshot() {
        self.snapshots.model = angular.copy(self.snapshots.save);
        self.snapshots.save = null;
      };

      self.setSnapshot = function setSnapshot() {
        const tabChange = [];
        const tabTmp = [];
        self.loading = true;

        angular.forEach(self.snapshots.save, (value) => {
          tabTmp[value.type] = value.active;
        });
        angular.forEach(self.snapshots.model, (value) => {
          if (tabTmp[value.type] !== value.active) {
            tabChange.push(value);
          }
        });

        if (tabChange.length > 0) {
          Nas.postSnapshots($stateParams.nasId, self.partitionName, tabChange)
            .then(
              () => {
                $rootScope.$broadcast('nas_launch_task');
                Alerter.success(
                  $translate.instant('nas_snapshot_set_success'),
                  alerterId,
                );
                self.snapshots.save = null;
                self.disable.taskDoing = true;
              },
              (data) => {
                if (data.length !== tabChange.length) {
                  $rootScope.$broadcast('nas_launch_task');
                }
                const listError = [];
                angular.forEach(data, (error) => {
                  listError.push(
                    $translate.instant(`nas_snapshot_${error.type}`),
                  );
                });
                load();
                Alerter.error(
                  $translate.instant('nas_snapshot_set_failure', {
                    t0: listError.join(', '),
                  }),
                  alerterId,
                );
              },
            )
            .finally(() => {
              getTaskInProgress();
              self.loading = false;
            });
        } else {
          self.snapshots.save = null;
          self.loading = false;
        }
      };

      $scope.$on('nas_snapshot_updated', () => {
        load();
      });

      load();
    },
  );
