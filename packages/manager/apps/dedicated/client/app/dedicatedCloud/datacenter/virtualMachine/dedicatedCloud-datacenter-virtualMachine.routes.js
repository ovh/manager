import { VIRTUAL_MACHINES_TITLE } from '../../../components/dedicated-cloud/datacenter/virtualMachine/constants';

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

        breadcrumb: () => VIRTUAL_MACHINES_TITLE,
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
        goToSetLicense: /* @ngInject */ (
          $state,
          currentService,
          datacenterId,
        ) => (vm) => {
          return $state.go(
            'app.dedicatedCloud.details.datacenter.details.virtualMachines.setLicense',
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
              reload: false,
            },
          );

          if (message) {
            promise.then(() => $timeout(() => setMessage(message, type)));
          }

          return promise;
        },
      },
    },
  );
};
