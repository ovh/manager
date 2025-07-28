export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.dashboard.deleteZerto', {
    url: '/deleteZerto',
    views: {
      modal: {
        component: 'dedicatedCloudDatacenterZertoDelete',
      },
    },
    layout: 'modal',
    resolve: {
      zertoInformations: /* @ngInject */ (currentZerto, dedicatedCloudZerto) =>
        dedicatedCloudZerto.constructor.getPlanServiceInformations(
          currentZerto,
        ),
      breadcrumb: () => null,
    },
  });
};
