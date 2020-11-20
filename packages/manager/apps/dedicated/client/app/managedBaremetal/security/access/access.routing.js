export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security.access', {
    url: '/access',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAccess',
      },
    },
    layout: 'modal',
  });
};
