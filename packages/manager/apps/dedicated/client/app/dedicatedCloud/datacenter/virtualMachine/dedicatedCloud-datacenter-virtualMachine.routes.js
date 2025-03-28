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

        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'dedicated_cloud_datacenters_datacenter_virtualmachine',
          ),
      },
    },
  );
};
