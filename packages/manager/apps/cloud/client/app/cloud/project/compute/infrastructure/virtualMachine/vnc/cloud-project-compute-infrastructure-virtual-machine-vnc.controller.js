angular
  .module('managerApp')
  .controller(
    'CloudProjectComputeInfrastructureVirtualmachineVncCtrl',
    function CloudProjectComputeInfrastructureVirtualmachineVncCtrl(
      $uibModalInstance,
      params,
      $translate,
      CucCloudMessage,
      OvhApiCloudProjectInstance,
    ) {
      const self = this;
      this.loading = true;
      this.fullscreen = false;
      this.data = {
        vm: params,
      };

      function init() {
        self.loading = true;
        return OvhApiCloudProjectInstance.v6()
          .vnc(
            {
              serviceName: self.data.vm.serviceName,
              instanceId: self.data.vm.id,
            },
            {},
          )
          .$promise.then(
            (vncInfos) => {
              self.data.url = vncInfos.url;
              self.loading = false;
            },
            (err) => {
              CucCloudMessage.error(
                [
                  $translate.instant('cpcivm_vnc_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
              $uibModalInstance.dismiss();
            },
          );
      }
      this.close = function close() {
        $uibModalInstance.dismiss();
      };

      init();
    },
  );
