import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerCloudConnectDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('cloud-connect.details.logs.data-streams.**', {
      url: '',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./data-streams.module').then((mod) => {
          return $ocLazyLoad.inject(mod.default || mod);
        });
      },
    });
  },
);

export default moduleName;
