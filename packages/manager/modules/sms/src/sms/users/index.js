import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';


const moduleName = 'ovhManagerSmsSmsUsers';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ]).config(($stateProvider) => {
    $stateProvider.state('sms.service.users.**', {
      url: '/users',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./telecom-sms-users.component')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
