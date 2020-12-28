export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAdd',
      },
    },
    layout: 'modal',
  });
};
