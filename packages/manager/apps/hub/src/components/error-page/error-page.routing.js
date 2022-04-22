export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    params: {
      detail: null,
      to: null,
    },
    url: '/error',
    views: {
      'app@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ ($state) => $state.href('app'),
      error: /* @ngInject */ ($transition$) => $transition$.params(),
      product: /* @ngInject */ () => 'hub',
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
