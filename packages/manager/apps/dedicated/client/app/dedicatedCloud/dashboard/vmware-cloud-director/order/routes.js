export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.dedicatedCloud.details.dashboard.vcd-order', {
    url: '/vcd-order',
    views: {
      modal: {
        component: 'ovhManagerPccVmwareCloudDirectorOrder',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('managedVCDAvailability')
        .then((managedVCDAvailability) =>
          !managedVCDAvailability
            ? { state: 'app.dedicatedCloud.details.dashboard' }
            : false,
        ),
    layout: { name: 'modal', backdrop: 'static', keyboard: true },
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      datacenters: /* @ngInject */ (datacenterList) => datacenterList,
      breadcrumb: () => null,
    },
  });
