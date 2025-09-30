import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerExchangeLogsDataStreamsLazyLoading';

angular.module(moduleName, ['oc.lazyLoad', 'ui.router']).config(
  /* @ngInject */
  ($stateProvider) => {
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./data-streams.module').then((mod) =>
        $ocLazyLoad.inject(mod.default || mod),
      );
    };

    $stateProvider.state('exchange.dashboard.logs.data-streams.**', {
      url: '',
      lazyLoad,
    });
  },
);

export default moduleName;
