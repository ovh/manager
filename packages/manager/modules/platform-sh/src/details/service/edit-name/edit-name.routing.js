export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('platform-sh.details.service.edit-name', {
    url: '/edit-name',
    views: {
      modal: {
        component: 'platformShDetailsServiceEditName',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToProjectDetails) => goToProjectDetails,
      breadcrumb: () => null,
    },
  });
};
