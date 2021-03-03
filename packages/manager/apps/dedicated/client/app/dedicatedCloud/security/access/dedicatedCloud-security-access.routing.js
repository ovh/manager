export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.security.access', {
    url: '/access',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAccess',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
