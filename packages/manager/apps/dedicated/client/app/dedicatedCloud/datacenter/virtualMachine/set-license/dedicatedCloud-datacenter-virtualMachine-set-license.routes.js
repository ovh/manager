export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines.setLicense',
    {
      url: '/set-license?vmId',
      params: {
        vmId: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerDedicatedCloudDataCenterVirtualMachineSetLicense',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goBackToVirtualMachines) =>
          goBackToVirtualMachines,
        vmId: /* @ngInject */ ($transition$) => $transition$.params().vmId,
        breadcrumb: () => null,
      },
    },
  );
};
