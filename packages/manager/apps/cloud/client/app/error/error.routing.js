export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('error', {
    url: '/error',
    params: {
      detail: null,
    },
    views: {
      'root@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ ($state) => $state.href('home'),
      error: /* @ngInject */ ($transition$) => $transition$.params(),
      submitAction: /* @ngInject */ ($window) => () =>
        $window.location.reload(),
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
    },
  });
};
