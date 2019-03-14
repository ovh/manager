export default /* @ngInject */ function ($stateProvider) {
  $stateProvider
    .state('adp.**', {
      url: '/adp/',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import('./adp.component')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
}
