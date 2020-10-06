export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'platform-sh.details.service.cancel',
    {
      url: '/cancel',
      views: {
        modal: {
          component: 'platformShDetailsServiceTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ (goToProjectDetails) =>
          goToProjectDetails,
        breadcrumb: () => null,
      },
    },
  );
};
