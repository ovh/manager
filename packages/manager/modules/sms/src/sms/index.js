import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsSms';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
]).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.**', {
    url: '/sms',
    lazyLoad: ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import('./telecom-sms-sms.component')
        .then(mod => $ocLazyLoad.inject(mod.default || mod));
    },
  });
});

export default moduleName;
