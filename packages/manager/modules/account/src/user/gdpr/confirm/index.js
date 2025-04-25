import 'oclazyload';

const moduleName = 'ovhManagerAccountGdprConfirmModuleLazyLoading';

angular
  .module(moduleName, [])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('account.user.gdpr.confirm.**', {
        url: '/:publicId/confirm-request-erasure',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./confirm-request-erasure.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
