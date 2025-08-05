export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.migrate-offer', {
    url: '/migrate',
    views: {
      modal: {
        component: 'cloudConnectDetailsMigrateOffer',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      breadcrumb: () => null,
    },
  });
};
