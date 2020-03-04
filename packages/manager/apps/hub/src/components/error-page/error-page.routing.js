export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    params: {
      detail: null,
    },
    url: '/error',
    views: {
      'app@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ ($state) => $state.href('app'),
      error: /* @ngInject */ ($transition$) => $transition$.params(),
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
    },
  });
};
