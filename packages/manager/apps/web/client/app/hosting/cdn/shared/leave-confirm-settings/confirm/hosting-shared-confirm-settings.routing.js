export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.cdn.shared.confirmSettings', {
    url: '/add-cache-rule',
    views: {
      modal: {
        component: 'managerHostingSharedConfirmSettings',
      },
    },
    params: {
      model: null,
      rules: null,
      success: null,
      cancel: null,
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      model: /* @ngInject */ ($transition$) => $transition$.params().model,

      rules: /* @ngInject */ ($transition$) => $transition$.params().rules,

      success: /* @ngInject */ ($transition$) => $transition$.params().success,

      cancel: /* @ngInject */ ($transition$) => $transition$.params().cancel,
    },
    atInternet: {
      rename: 'web::hosting::cdn::configure::apply-configuration',
    },
  });
};
