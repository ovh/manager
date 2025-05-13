import get from 'lodash/get';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.expired', {
    url: '/expired',
    params: {
      error: null,
      product: null,
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
      product: /* @ngInject */ ($transition$) => {
        // URI params are removed from error tracking
        const product = $transition$.params()?.product;
        return product?.split('?')[0];
      },
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
