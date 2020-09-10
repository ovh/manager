export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security.access', {
    url: '/access',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAccess',
      },
    },
    layout: 'modal',
  });
};
