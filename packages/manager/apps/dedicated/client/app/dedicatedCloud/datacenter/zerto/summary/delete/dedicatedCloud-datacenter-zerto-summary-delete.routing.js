export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.zerto.summary.deleteZerto',
    {
      url: '/deleteZerto',
      views: {
        modal: {
          component: 'dedicatedCloudDatacenterZertoDelete',
        },
      },
      layout: 'modal',
      resolve: {
        zertoInformations: /* @ngInject */ (
          currentZerto,
          dedicatedCloudZerto,
        ) =>
          dedicatedCloudZerto.constructor.getPlanServiceInformations(
            currentZerto,
          ),

        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        breadcrumb: () => null,
      },
    },
  );
};
