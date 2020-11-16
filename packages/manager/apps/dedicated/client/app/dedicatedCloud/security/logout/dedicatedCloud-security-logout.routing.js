export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.security.logout', {
    url: '/logout',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityLogout',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
