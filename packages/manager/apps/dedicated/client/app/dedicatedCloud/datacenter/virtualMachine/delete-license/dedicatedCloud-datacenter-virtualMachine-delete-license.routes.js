export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.virtualMachines.deleteLicense',
    {
      url: '/delete-license?vmId',
      params: {
        vmId: null,
      },
      views: {
        modal: {
          component:
            'ovhManagerDedicatedCloudDataCenterVirtualMachineDeleteLicense',
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
