export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('app.managedBaremetal.details.dashboard.vcd-order', {
    url: '/vcd-order',
    views: {
      modal: {
        component: 'ovhManagerPccVmwareCloudDirectorOrder',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('dedicatedCloudDescription')
        .then((dedicatedCloudDescription) =>
          !dedicatedCloudDescription.canMigrateToVCD
            ? { state: 'app.managedBaremetal.details.dashboard' }
            : false,
        ),
    layout: { name: 'modal', backdrop: 'static', keyboard: true },
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      datacenters: /* @ngInject */ (datacenterList) => datacenterList,
      breadcrumb: () => null,
    },
  });
