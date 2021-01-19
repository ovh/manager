import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.expired', {
    url: '/expired',
    params: {
      error: null,
    },
    views: {
      'container@': {
        component: 'managerErrorPage',
      },
    },
    resolve: {
      cancelLink: /* @ngInject */ ($state) =>
        $state.href('app.configuration', { reload: true }),
      error: /* @ngInject */ ($transition$) =>
        get($transition$.params(), 'error'),
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
      breadcrumb: () => null,
    },
  });
};
