export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.security.kms-add', {
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
