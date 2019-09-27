export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecomError', {
    params: {
      detail: null,
    },
    url: '/error',
    views: {
      'root@': 'managerErrorPage',
    },
    resolve: {
      cancelLink: /* @ngInject */ $state => $state.href('telecom'),
      error: /* @ngInject */ $transition$ => $transition$.params(),
      submitAction: /* @ngInject */ $window => () => $window.location.reload(),
      translationsRefresh: /* @ngInject */ $translate => $translate.refresh(),
    },
  });
};
