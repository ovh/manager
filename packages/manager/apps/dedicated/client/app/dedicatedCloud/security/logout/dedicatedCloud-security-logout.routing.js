export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security.logout', {
    url: '/logout',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityLogout',
      },
    },
    layout: 'modal',
  });
};
