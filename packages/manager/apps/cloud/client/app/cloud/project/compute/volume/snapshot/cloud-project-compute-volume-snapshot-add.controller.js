import round from 'lodash/round';

angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeVolumeSnapshotAddCtrl',
    function CloudProjectComputeVolumeSnapshotAddCtrl(
      $scope,
      $stateParams,
      $uibModalInstance,
      params,
      CucCloudMessage,
      $translate,
      $filter,
      $q,
      CucPriceHelper,
      CloudProjectComputeVolumesOrchestrator,
    ) {
      const self = this;
      const serviceName = $stateParams.projectId;

      self.snapshot = {
        volume: params,
        name: null,
        price: null,
        priceText: null,
      };

      self.loaders = {
        init: false,
        snapshot: false,
      };

      function init() {
        self.loaders.init = true;
        const volumeSnapshotConsumption = 'volume.snapshot.consumption';
        CucPriceHelper.getPrices(serviceName)
          .then((prices) => {
            const price =
              prices[
                `${volumeSnapshotConsumption}.${self.snapshot.volume.region}`
              ] || prices[volumeSnapshotConsumption];
            if (price) {
              self.snapshot.price =
                (price.priceInUcents *
                  self.snapshot.volume.size *
                  moment.duration(1, 'months').asHours()) /
                100000000;
              self.snapshot.priceText = price.price.text.replace(
                /\d+(?:[.,]\d+)?/,
                round(self.snapshot.price.toString(), 2),
              );
            }
            self.snapshot.name = `${self.snapshot.volume.name} ${$filter(
              'date',
            )(new Date(), 'short')}`;
          })
          .finally(() => {
            self.loaders.init = false;
          });
      }

      self.confirmSnapshot = function confirmSnapshot() {
        self.loaders.snapshot = true;
        CloudProjectComputeVolumesOrchestrator.snapshotVolume(
          self.snapshot.volume,
          self.snapshot.name,
        )
          .then(
            () => {
              $uibModalInstance.close(self.snapshot);
              CucCloudMessage.info(
                $translate.instant('cpcv_snapshot_creation_info'),
                { hideAfter: 3 },
              );
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpcv_snapshot_creation_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            },
          )
          .finally(() => {
            self.loaders.snapshot = false;
          });
      };

      self.cancel = function cancel() {
        $uibModalInstance.dismiss(self.snapshot);
      };

      init();
    },
  );
