import has from 'lodash/has';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared.edit-urls', {
    url: '/edit-urls',
    layout: 'modal',
    views: {
      modal: {
        component: 'editUrlsComponent',
      },
    },
    params: {
      model: null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('model')
        .then((model) => {
          return !has(model, 'options.cache.prewarm.api')
            ? { state: 'app.hosting.dashboard.cdn.shared' }
            : false;
        }),
    resolve: {
      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().domainName,

      model: /* @ngInject */ ($transition$) => $transition$.params().model,

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
