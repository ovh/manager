angular
  .module('App')
  .controller('PartitionCtrl', function PartitionCtrl(
    $stateParams,
    $scope,
    $state,
    $translate,
    Nas,
    Alerter,
  ) {
    const alerterId = 'NasAlert';
    const self = this;

    self.table = {
      partitionIds: [],
      partitionDetails: [],
      refresh: false,
    };

    self.data = {
      nas: null,
    };

    self.loaders = {
      table: false,
    };

    $scope.partitions = null;
    $scope.currentActionParams = null;
    $scope.nasType = Nas.getNasType($stateParams.nasId);

    // LOAD

    self.$onInit = function $onInit() {
      $scope.backToPartition();
      self.getPartitions();

      Nas.getSelected($stateParams.nasId).then((nas) => {
        self.data.nas = nas;
      });
    };

    self.loadDatagridPartitions = ({ offset, pageSize }) =>
      self.getPartitions().then(() => {
        const part = self.table.partitionIds.slice(
          offset - 1,
          offset - 1 + pageSize,
        );
        return {
          data: part.map((id) => ({ id })),
          meta: {
            totalCount: self.table.partitionIds.length,
          },
        };
      });

    self.getPartitions = function getPartitions(forceRefresh) {
      self.loaders.table = true;

      return Nas.getPartitionsIds($stateParams.nasId, forceRefresh)
        .then(
          (partitionIds) => {
            self.table.partitionIds = partitionIds;
            if (forceRefresh) {
              self.table.refresh = !self.table.refresh;
            }
          },
          (data) => {
            self.table.partitionIds = null;
            self.loaders.table = false;
            Alerter.alertFromSWS(
              $translate.instant('nas_partitions_loading_error'),
              data,
              alerterId,
            );
          },
        )
        .finally(() => {
          self.loaders.table = false;
        });
    };

    $scope.$on('nas_partitions_updated', () => {
      self.getPartitions(true);
    });

    self.transformItem = function transformItem(partition) {
      return Nas.getPartition($stateParams.nasId, partition.id);
    };

    self.displayAccess = (partition) => {
      $state.go('app.dedicated-nas.details.partition.dashboard.access', {
        partitionName: partition.partitionName,
      });
    };

    self.displaySnapshots = (partition) => {
      $state.go('app.dedicated-nas.details.partition.dashboard.snapshot', {
        partitionName: partition.partitionName,
      });
    };

    // TOOLS

    self.isNasha = function isNasha() {
      return $stateParams.nasId.indexOf('nasha') !== -1;
    };

    self.goToSubTable = function goToSubTable(subTable, data) {
      $scope.context = `dedicated/nas/partition/${subTable}/nas-partition-${subTable}.html`;
      $scope.currentActionParams = data;
    };

    $scope.backToPartition = function backToPartition() {
      $scope.context = 'dedicated/nas/partition/nas-partition-information.html';
    };
  });
