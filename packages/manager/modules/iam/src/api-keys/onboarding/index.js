import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

const moduleName = 'ovhManagerIAMApiKeyOnboardingsLazyLoading';

angular.module(moduleName, [uiRouter, ocLazyLoad]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.api-keys.onboarding.**', {
      url: '/onboarding',
      lazyLoad: (transition) =>
        import('./api-keys-onboarding.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
