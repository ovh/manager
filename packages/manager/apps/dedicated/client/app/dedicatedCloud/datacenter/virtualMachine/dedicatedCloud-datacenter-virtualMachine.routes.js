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

        breadcrumb: /* @ngInject */ () => VIRTUAL_MACHINES_TITLE,
      },
    },
  );
};
