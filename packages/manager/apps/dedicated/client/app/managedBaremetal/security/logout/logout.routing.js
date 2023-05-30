export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security.logout', {
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
