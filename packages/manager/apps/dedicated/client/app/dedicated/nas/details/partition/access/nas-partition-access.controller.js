angular
  .module('App')
  .controller(
    'NasPartitionAccessCtrl',
    function NasPartitionAccessCtrl(
      $scope,
      $stateParams,
      $translate,
      Nas,
      Alerter,
    ) {
      const alerterId = 'NasAlert';
      const self = this;

      self.table = {
        accessIds: [],
        accessDetails: [],
        refresh: false,
      };

      self.loaders = {
        table: false,
      };

      self.partitionName = $stateParams.partitionName;

      self.getAccess = function getAccess(forceRefresh) {
        self.loaders.table = true;

        return Nas.getAccessIds(
          $stateParams.nasId,
          self.partitionName,
          forceRefresh,
        )
          .then(
            (accessIds) => {
              self.table.accessIds = accessIds;
              if (forceRefresh) {
                self.table.refresh = !self.table.refresh;
              }
              return self.table.accessIds;
            },
            (data) => {
              self.table.accessIds = null;
              self.loaders.table = false;
              Alerter.alertFromSWS(
                $translate.instant('nas_access_loading_error'),
                data,
                alerterId,
              );
            },
          )
          .finally(() => {
            self.loaders.table = false;
          });
      };

      self.loadDatagridAccess = ({ offset, pageSize }) =>
        self.getAccess(true).then((access) => {
          const data = access.slice(offset - 1, offset - 1 + pageSize);
          return {
            data,
            meta: {
              totalCount: access.length,
            },
          };
        });

      $scope.$on('nas_access_updated', () => {
        self.getAccess(true);
      });

      self.getAccess();
    },
  );
