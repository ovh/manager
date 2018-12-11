import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSms';

angular.module(moduleName, [
  'ui.router',
  'oc.lazyLoad',
])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state('sms.**', {
      url: '/sms/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms.component')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
