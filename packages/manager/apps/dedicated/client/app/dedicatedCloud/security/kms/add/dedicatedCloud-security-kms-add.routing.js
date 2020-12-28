export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.security.kms-add', {
    url: '/kms-add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityKmsAdd',
      },
    },
    layout: 'modal',
  });
};
