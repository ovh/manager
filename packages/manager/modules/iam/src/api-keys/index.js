import uiRouter from '@uirouter/angularjs';
import ocLazyLoad from 'oclazyload';

const moduleName = 'ovhManagerIAMApiKeysLazyLoading';

angular.module(moduleName, [uiRouter, ocLazyLoad]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('iam.api-keys.**', {
      url: '/api-keys',
      lazyLoad: (transition) =>
        import('./api-keys.module').then((module) =>
          transition
            .injector()
            .get('$ocLazyLoad')
            .inject(module.default),
        ),
    });
  },
);

export default moduleName;
