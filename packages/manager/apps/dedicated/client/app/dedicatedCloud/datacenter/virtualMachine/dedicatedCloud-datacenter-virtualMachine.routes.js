import { TRACKING_DISPLAY_LISTING_VIRTUAL_MACHINES_PREFIX } from './constants';
import { TRACKING_PREFIX_DATACENTER } from '../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines',
    {
      reloadOnSearch: false,
      url: '/virtual-machines',
      views: {
        pccDatacenterView: 'ovhManagerDedicatedCloudDatacenterVirtualMachine',
      },
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_LISTING_VIRTUAL_MACHINES_PREFIX}`,
      },
      resolve: {
        serviceId: /* @ngInject */ (currentService) =>
          currentService.serviceInfos.serviceId,

        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicatedCloud_tab_virtualmachine'),
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
              guestOsFamily: vm.guestOsFamily,
              license: vm.license,
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
              guestOsFamily: vm.guestOsFamily,
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
