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
      product: /* @ngInject */ ($state, $transition$) => {
        const { state, params } = $transition$.params().to;
        // href will include # so split with '/' and take second element
        const [, product] = $state
          .href(state, params, { lossy: true })
          .split('/');
        // URI params are removed from error tracking
        return product?.split('?')[0];
      },
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
    },
    atInternet: {
      ignore: true,
    },
  });
};
