import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';
import 'ovh-angular-contact';

import './modems-order.scss';

const moduleName = 'ovhManagerSpareOrderModemLazyLoading';

angular
  .module(moduleName, [
    'ovh-angular-contact',
    'ui.router',
    'oc.lazyLoad',
    'ui.select',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('spare.modems.order.**', {
      url: '/order',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./modems-order.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
