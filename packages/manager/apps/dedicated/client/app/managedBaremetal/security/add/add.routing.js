export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.security.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerPccSecurityAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
