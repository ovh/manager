angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeSnapshotAddCtrl',
    function CloudProjectComputeSnapshotAddCtrl(
      $uibModalInstance,
      $translate,
      $filter,
      params,
      CucCloudMessage,
      OvhApiCloudProjectSnapshot,
      atInternet,
      CloudProjectComputeInfrastructureOrchestrator,
      CloudProjectComputeSnapshotPriceService,
    ) {
      const self = this;

      self.snapshot = {
        vm: params,
        name: [params.name, $filter('date')(new Date(), 'short')].join(' '),
      };
      self.loaders = {
        backup: false,
      };

      self.snapshotPriceStruct = {
        prices: [],
        size: params.flavor.disk,
        total: {},
      };

      self.backup = function backup() {
        self.loaders.backup = true;
        OvhApiCloudProjectSnapshot.v6().resetQueryCache();
        CloudProjectComputeInfrastructureOrchestrator.backupVm(
          self.snapshot.vm,
          self.snapshot.name,
        )
          .then(
            () => {
              CucCloudMessage.success(
                $translate.instant('cpc_snapshot_add_success', {
                  snapshotname: self.snapshot.name,
                }),
              );
              $uibModalInstance.close(self.snapshot);
              atInternet.trackOrder({
                name: `[SNAPSHOT]${self.snapshot.vm.flavor.groupName.replace(
                  /[\W_]+/g,
                  '',
                )}[${self.snapshot.vm.flavor.groupName}]`,
                page: 'iaas::pci-project::compute::infrastructure::order',
                priceTaxFree: self.snapshotPriceStruct.total.value,
              });
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpc_snapshot_add_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            },
          )
          .finally(() => {
            self.loaders.backup = false;
          });
      };

      self.getPriceData = function getPriceData() {
        CloudProjectComputeSnapshotPriceService.getSnapshotPrice({
          size: self.snapshotPriceStruct.size,
          serviceName: self.snapshot.vm.serviceName,
          region: self.snapshot.vm.region,
        }).then((data) => {
          self.snapshotPriceStruct.prices = [data];
          self.snapshotPriceStruct.total = data.totalPrice;
        });
      };

      self.cancel = function cancel() {
        $uibModalInstance.dismiss(self.snapshot);
      };

      self.getPriceData();
    },
  );
