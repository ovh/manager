export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security.kms-add', {
    url: '/kms-add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityKmsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
