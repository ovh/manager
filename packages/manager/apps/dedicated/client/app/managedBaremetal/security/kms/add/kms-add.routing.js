export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.security.kms-add', {
    url: '/kms-add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityKmsAdd',
      },
    },
    layout: 'modal',
  });
};
