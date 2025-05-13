export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.dashboard.security-options',
    {
      url: '/security-options',
      params: {
        optionName: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPccSecurityOptions',
        },
      },
      layout: 'modal',
      resolve: {
        optionName: /* @ngInject */ ($transition$) =>
          $transition$.params().optionName,
        breadcrumb: () => null,
      },
    },
  );
};
