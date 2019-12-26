export default /* @ngInject */ function($stateProvider) {
  $stateProvider.state('welcome', {
    url: '/welcome',
    component: 'ovhManagerWelcomeComponent',
    lazyLoad: ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./manager-welcome.component').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    },
  });
}
