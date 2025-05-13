export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    params: {
      detail: null,
      to: null,
    },
    url: '/error',
    component: 'managerErrorPage',
    resolve: {
      cancelLink: /* @ngInject */ ($state) => $state.href('app'),
      error: /* @ngInject */ ($transition$) => $transition$.params(),
      product: /* @ngInject */ () => 'netapp',
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
