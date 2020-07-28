import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerEmailproLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./emailpro.module').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    };

    $stateProvider.state('app.emails-pro.**', {
      url: '/configuration/email_pro',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./email-pro/email-pro.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
    $stateProvider
      .state('app.email-pro.**', {
        url: '/configuration/email_pro/:productId?tab',
        lazyLoad,
      })
      .state('app.email.mxplan.**', {
        url: '/configuration/email_mxplan/:productId?tab',
        lazyLoad,
      });
  },
);

export default moduleName;
