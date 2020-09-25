export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAdd',
      },
    },
    layout: 'modal',
  });
};
