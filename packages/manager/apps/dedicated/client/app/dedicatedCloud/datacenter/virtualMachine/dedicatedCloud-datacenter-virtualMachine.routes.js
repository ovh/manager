import { VIRTUAL_MACHINES_TITLE } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines',
    {
      reloadOnSearch: false,
      url: '/virtual-machines',
      views: {
        pccDatacenterView: 'ovhManagerDedicatedCloudDatacenterVirtualMachine',
      },
      resolve: {
        serviceId: /* @ngInject */ (currentService) =>
          currentService.serviceInfos.serviceId,

        goToDeleteLicense: /* @ngInject */ (
          $state,
          currentService,
          datacenterId,
        ) => (vm) => {
          return $state.go(
            'app.dedicatedCloud.details.datacenter.details.virtualMachines.deleteLicense',
            {
              serviceName: currentService.serviceName,
              datacenterId,
              vmId: vm.vmId,
            },
          );
        },

        goBackToVirtualMachines: /* @ngInject */ (
          $state,
          $timeout,
          currentService,
          setMessage,
        ) => (message = false, type = 'success') => {
          const promise = $state.go(
            'app.dedicatedCloud.details.datacenter.details.virtualMachines',
            { productId: currentService.serviceName },
            {
              reload: false, // No need to reload terrible user experience, and vm license is not even updated
            },
          );

          if (message) {
            promise.then(() => $timeout(() => setMessage(message, type)));
          }

          return promise;
        },

        breadcrumb: /* @ngInject */ () => VIRTUAL_MACHINES_TITLE,
      },
    },
  );
};
