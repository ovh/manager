export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.access', {
    url: '/access',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAccess',
      },
    },
    layout: 'modal',
  });
};
