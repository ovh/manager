import { CDN_ADVANCED } from './hosting-shared-add-edit-cache-rule.constants';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    goBack: /* @ngInject */ ($state) => () => $state.go('^'),

    rules: /* @ngInject */ ($transition$) => $transition$.params().rules,

    priority: /* @ngInject */ ($transition$) => $transition$.params().priority,

    callbacks: /* @ngInject */ ($transition$) =>
      $transition$.params().callbacks,

    resourceTypes: /* @ngInject */ ($http) =>
      $http
        .get('/hosting/web.json')
        .then(({ data }) => data?.models?.['cdn.OptionPatternTypeEnum'].enum),

    enableOnlyExtension: /* @ngInject */ (cdnProperties) =>
      cdnProperties.type !== CDN_ADVANCED,
  };
  const resolveEdit = {
    rule: /* @ngInject */ ($transition$) => $transition$.params().rule,
  };
  const params = {
    rules: null,
    priority: null,
    callbacks: null,
  };
  const paramsEdit = {
    rule: null,
  };

  $stateProvider.state('app.hosting.dashboard.cdn.shared.addCacheRule', {
    url: '/add-cache-rule',
    views: {
      modal: {
        component: 'hostingSharedSettingsAddCacheRule',
      },
    },
    params,
    layout: 'modal',
    resolve,
    atInternet: {
      rename: 'web::hosting::cdn::configure::create-rule',
    },
  });

  $stateProvider.state('app.hosting.dashboard.cdn.shared.editCacheRule', {
    url: '/edit-cache-rule',
    views: {
      modal: {
        component: 'hostingSharedSettingsAddCacheRule',
      },
    },
    params: { ...params, ...paramsEdit },
    layout: 'modal',
    resolve: { ...resolve, ...resolveEdit },
  });
};
