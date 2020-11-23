export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.backup.upgrade',
    {
      url: '/upgrade',
      params: {
        actualOffer: null,
      },
      resolve: {
        actualOffer: /* @ngInject */ ($transition$) =>
          $transition$.params().actualOffer,
        breadcrumb: () => null,
      },
      views: {
        modal: {
          component: 'dedicatedCloudDatacenterBackupUpgrade',
        },
      },
      layout: 'modal',
    },
  );
};
