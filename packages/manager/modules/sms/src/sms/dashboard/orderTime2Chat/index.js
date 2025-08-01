import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerSmsOrderTime2ChatComponentLazyloading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.dashboard.orderTime2Chat.**', {
      url: '/orderTime2Chat',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./orderTime2Chat.module').then((mod) =>
          $ocLazyLoad.inject(mod.default || mod),
        );
      },
    });
  });

export default moduleName;
