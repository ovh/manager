export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.logout', {
    url: '/logout',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityLogout',
      },
    },
    layout: 'modal',
  });
};
